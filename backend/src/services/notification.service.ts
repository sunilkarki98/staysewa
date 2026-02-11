import { logger } from '@/utils/logger';

export type NotificationPayload = {
    userId: string;
    title: string;
    body: string;
    meta?: Record<string, any>;
};

export const NotificationService = {
    /**
     * Send a notification to a user (Email/Push/SMS)
     */
    async notify(payload: NotificationPayload) {
        // In a production scenario, this would integrate with:
        // - Resend/SendGrid for Email
        // - Twilio for SMS
        // - Firebase for Push

        logger.info({
            to: payload.userId,
            title: payload.title,
            body: payload.body,
        }, 'Notification Dispatched');

        // Placeholder for actual transport logic
        return true;
    },

    /**
     * Specialized notification for booking confirmation
     */
    async sendBookingConfirmation(data: {
        userId: string;
        bookingNumber: string;
        stayName: string;
        totalAmount: number;
    }) {
        return this.notify({
            userId: data.userId,
            title: 'Booking Confirmed! 🎉',
            body: `Your booking ${data.bookingNumber} for ${data.stayName} has been confirmed. Total Paid: NPR ${data.totalAmount}.`,
            meta: { bookingNumber: data.bookingNumber }
        });
    },

    /**
     * Specialized notification for owners on new bookings
     */
    async notifyOwnerOfNewBooking(data: {
        ownerId: string;
        bookingNumber: string;
        guestName: string;
    }) {
        return this.notify({
            userId: data.ownerId,
            title: 'New Booking Received!',
            body: `${data.guestName} just booked your property. Booking Reference: ${data.bookingNumber}.`,
            meta: { bookingNumber: data.bookingNumber }
        });
    }
};
