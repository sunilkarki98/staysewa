import axios from 'axios';
import { db } from '@/db/index';
import { payments, bookings, properties } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/AppError';
import { NotificationService } from './notification.service';

export const PaymentService = {
    /**
     * Initiate a Khalti payment
     */
    async initiateKhalti(bookingId: string) {
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, bookingId),
        });

        if (!booking) throw new AppError('Booking not found', 404);

        const amount = booking.total_amount;

        const payload = {
            return_url: `${env.CORS_ORIGIN}/payment/verify`,
            website_url: env.CORS_ORIGIN,
            amount: amount,
            purchase_order_id: booking.id,
            purchase_order_name: `Booking ${booking.booking_number}`,
        };

        try {
            const response = await axios.post(`${env.KHALTI_BASE_URL}/epayment/initiate/`, payload, {
                headers: {
                    'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                }
            });

            // Log initiation in database
            await db.insert(payments).values({
                booking_id: booking.id,
                user_id: booking.customer_id,
                amount: amount,
                method: 'khalti',
                transaction_id: response.data.pidx,
                status: 'initiated',
            });

            return response.data;
        } catch (error: unknown) {
            const err = error as any;
            logger.error(err.response?.data || err.message, 'Khalti Initiation Failed');
            throw new AppError('Failed to initiate payment with Khalti', 502);
        }
    },

    /**
     * Core logic to finalize a payment and booking
     */
    async finalizePayment(pidx: string, purchaseOrderId: string, gatewayResponse: Record<string, unknown>) {
        return await db.transaction(async (tx) => {
            const existingPayment = await tx.query.payments.findFirst({
                where: eq(payments.transaction_id, pidx),
            });

            if (existingPayment?.status === 'completed') {
                return { success: true, message: 'Payment already processed' };
            }

            await tx.update(payments)
                .set({
                    status: 'completed',
                    processed_at: new Date(),
                    gateway_response: gatewayResponse
                })
                .where(eq(payments.transaction_id, pidx));

            const [updatedBooking] = await tx.update(bookings)
                .set({
                    payment_status: 'paid',
                    status: 'confirmed',
                    confirmed_at: new Date()
                })
                .where(eq(bookings.id, purchaseOrderId))
                .returning();

            if (updatedBooking) {
                const property = await tx.query.properties.findFirst({
                    where: eq(properties.id, updatedBooking.property_id),
                });

                NotificationService.sendBookingConfirmation({
                    userId: updatedBooking.customer_id,
                    bookingNumber: updatedBooking.booking_number,
                    stayName: property?.name || 'Property',
                    totalAmount: updatedBooking.total_amount,
                }).catch(err => logger.error(err, 'Guest Notification Failed'));

                NotificationService.notifyOwnerOfNewBooking({
                    ownerId: updatedBooking.owner_id,
                    bookingNumber: updatedBooking.booking_number,
                    guestName: updatedBooking.guest_name,
                }).catch(err => logger.error(err, 'Owner Notification Failed'));
            }

            return { success: true, message: 'Payment verified and booking confirmed' };
        });
    },

    /**
     * Verify a Khalti payment (User Callback)
     */
    async verifyKhalti(pidx: string) {
        try {
            const response = await axios.post(`${env.KHALTI_BASE_URL}/epayment/lookup/`, { pidx }, {
                headers: {
                    'Authorization': `Key ${env.KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                }
            });

            const { status, purchase_order_id } = response.data;

            if (status === 'Completed') {
                return await this.finalizePayment(pidx, purchase_order_id, response.data);
            }

            return { success: false, status, message: 'Payment not completed' };

        } catch (error: unknown) {
            const err = error as any;
            logger.error(err.response?.data || err.message, 'Khalti Verification Failed');
            throw new AppError('Failed to verify payment with Khalti', 502);
        }
    },

    /**
     * Handle Khalti Webhook (Server-to-Server)
     */
    async handleKhaltiWebhook(payload: { pidx: string; status: string; purchase_order_id: string }) {
        const { pidx, status, purchase_order_id } = payload;

        if (status === 'Completed') {
            logger.info({ pidx, purchase_order_id }, 'Received Khalti Webhook: Verifying...');

            try {
                const verification = await this.verifyKhalti(pidx);
                if (verification.success) {
                    logger.info({ pidx }, 'Webhook Verification Successful');
                    return { success: true, message: 'Payment verified and processed via webhook' };
                } else {
                    logger.warn({ pidx, verification }, 'Webhook Verification Failed: Payment not completed based on lookup');
                    return { success: false, message: 'Webhook verification failed' };
                }
            } catch (error) {
                logger.error(error, 'Webhook Verification Error');
                return { success: false, message: 'Error verifying webhook payload' };
            }
        }

        logger.warn({ pidx, status }, 'Received Non-Completed Khalti Webhook or invalid status');
        return { success: false, message: 'Webhook ignored: status not completed' };
    }
};
