import { pgEnum } from 'drizzle-orm/pg-core';

// ─── User & Auth ────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['customer', 'owner', 'admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);
export const idTypeEnum = pgEnum('id_type', ['citizenship', 'national_id_card', 'passport', 'national_id']);

// ─── Stay ───────────────────────────────────────────────────
export const stayTypeEnum = pgEnum('stay_type', ['hotel', 'homestay', 'apartment', 'room', 'hostel']);
export const stayIntentEnum = pgEnum('stay_intent', ['short_stay', 'long_stay', 'both']);
export const stayStatusEnum = pgEnum('stay_status', ['draft', 'pending_review', 'active', 'suspended', 'archived']);
export const unitTypeEnum = pgEnum('unit_type', ['private_room', 'shared_room', 'entire_place', 'bed']);
export const availabilityStatusEnum = pgEnum('availability_status', ['available', 'blocked', 'booked']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);

// ─── Booking ────────────────────────────────────────────────
export const bookingStatusEnum = pgEnum('booking_status', [
    'initiated', 'reserved', 'confirmed', 'checked_in', 'completed', 'cancelled', 'expired', 'no_show',
    'pending', // Legacy: kept for existing data
]);
export const paymentStatusEnum = pgEnum('payment_status', [
    'not_required', 'pending', 'success', 'failed', 'refunded', 'unpaid',
    'paid', // Legacy: kept for existing data
]);
export const cancelledByEnum = pgEnum('cancelled_by', ['customer', 'owner', 'admin', 'system']);

// ─── Payment ────────────────────────────────────────────────
export const paymentMethodEnum = pgEnum('payment_method', [
    'khalti', 'esewa', 'bank_transfer', 'cash', 'wallet',
]);
export const paymentTxnStatusEnum = pgEnum('payment_txn_status', [
    'initiated', 'pending', 'completed', 'failed', 'refunded',
]);

// ─── Pricing ────────────────────────────────────────────────
export const priceRuleTypeEnum = pgEnum('price_rule_type', [
    'seasonal', 'weekend', 'holiday', 'long_stay', 'last_minute',
]);
export const adjustmentTypeEnum = pgEnum('adjustment_type', ['fixed', 'percent']);

// ─── Cancellation ───────────────────────────────────────────
export const cancellationTypeEnum = pgEnum('cancellation_type', [
    'flexible', 'moderate', 'strict', 'non_refundable',
]);

// ─── Payout ─────────────────────────────────────────────────
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'completed', 'failed']);

// ─── Notification ───────────────────────────────────────────
export const notificationChannelEnum = pgEnum('notification_channel', [
    'in_app', 'email', 'sms', 'push',
]);

// ─── Support ────────────────────────────────────────────────
export const ticketCategoryEnum = pgEnum('ticket_category', [
    'booking', 'payment', 'property', 'account', 'other',
]);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'urgent']);
export const ticketStatusEnum = pgEnum('ticket_status', [
    'open', 'in_progress', 'waiting_customer', 'resolved', 'closed',
]);
