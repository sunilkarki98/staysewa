import axios from 'axios';
import { db } from '@/db/index';
import { payments, bookings, stays } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/AppError';
import { NotificationService } from './notification.service';

export const PaymentService = {
    /**
     * Initiate a Khalti payment
     */
    async initiateKhalti(bookingId: string, amount: number) {
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, bookingId),
        });

        if (!booking) throw new AppError('Booking not found', 404);

        const payload = {
            return_url: `${env.CORS_ORIGIN}/payment/verify`,
            website_url: env.CORS_ORIGIN,
            amount: amount * 100, // Khalti expects paisa
            purchase_order_id: booking.id,
            purchase_order_name: `Booking ${booking.bookingNumber}`,
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
                bookingId: booking.id,
                userId: booking.customerId,
                amount: amount,
                method: 'khalti',
                gatewayTxnId: response.data.pidx,
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
     * Shared by both verifyKhalti (Callback) and handleWebhook
     */
    async finalizePayment(pidx: string, purchaseOrderId: string, gatewayResponse: Record<string, unknown>) {
        return await db.transaction(async (tx) => {
            // 1. Get existing payment record to prevent duplicate processing
            const existingPayment = await tx.query.payments.findFirst({
                where: eq(payments.gatewayTxnId, pidx),
            });

            if (existingPayment?.status === 'completed') {
                return { success: true, message: 'Payment already processed' };
            }

            // 2. Update Payment Record
            await tx.update(payments)
                .set({
                    status: 'completed',
                    paidAt: new Date(),
                    gatewayResponse: gatewayResponse
                })
                .where(eq(payments.gatewayTxnId, pidx));

            // 3. Update Booking Status
            const [updatedBooking] = await tx.update(bookings)
                .set({
                    paymentStatus: 'paid',
                    status: 'confirmed',
                    confirmedAt: new Date()
                })
                .where(eq(bookings.id, purchaseOrderId))
                .returning();

            if (updatedBooking) {
                // Get stay name for notification
                const stay = await tx.query.stays.findFirst({
                    where: eq(stays.id, updatedBooking.stayId),
                });

                // 4. Trigger Notifications (Async)
                NotificationService.sendBookingConfirmation({
                    userId: updatedBooking.customerId,
                    bookingNumber: updatedBooking.bookingNumber,
                    stayName: stay?.name || 'Stay',
                    totalAmount: updatedBooking.totalAmount,
                }).catch(err => logger.error(err, 'Guest Notification Failed'));

                NotificationService.notifyOwnerOfNewBooking({
                    ownerId: updatedBooking.ownerId,
                    bookingNumber: updatedBooking.bookingNumber,
                    guestName: updatedBooking.guestName,
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

            // SECURITY: Verify the payment status with Khalti before trusting the webhook
            // This prevents spoofing attacks where an attacker sends a fake success webhook
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
                // Even if it fails, we return a 200 to Khalti so they don't retry indefinitely if it's our logic error? 
                // But validation error should probably return 400. 
                // for now, returning false lets the controller decide.
                return { success: false, message: 'Error verifying webhook payload' };
            }
        }

        logger.warn({ pidx, status }, 'Received Non-Completed Khalti Webhook or invalid status');
        return { success: false, message: 'Webhook ignored: status not completed' };
    }
};
