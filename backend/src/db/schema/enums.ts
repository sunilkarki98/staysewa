import { pgEnum } from 'drizzle-orm/pg-core';

/* ───── ENUMS ───── */
export const stayTypeEnum = ['hostel', 'flat', 'hotel', 'resort', 'homestay'] as const;
export const unitTypeEnum = ['single_room', 'double_room', 'triple_room', '1BHK', '2BHK', '3BHK', 'villa'] as const;
export const stayStatusEnum = ['draft', 'published', 'archived'] as const;
export const bookingStatusEnum = ['initiated', 'confirmed', 'cancelled', 'completed'] as const;
export const paymentStatusEnum = ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'] as const;
export const paymentMethodEnum = ['khalti', 'esewa', 'cash', 'card', 'bank_transfer'] as const;
export const cancellationTypeEnum = ['flexible', 'moderate', 'strict', 'non_refundable'] as const;
export const priceRuleTypeEnum = ['seasonal', 'weekend', 'custom', 'holiday'] as const;
export const adjustmentTypeEnum = ['fixed', 'percentage'] as const;
export const availabilityStatusEnum = ['available', 'unavailable', 'blocked'] as const;
export const mediaTypeEnum = ['image', 'video'] as const;
export const userRoleEnum = ['guest', 'owner', 'admin'] as const;
export const verificationStatusEnum = ['pending', 'verified', 'rejected'] as const;
export const payoutStatusEnum = ['pending', 'processing', 'completed', 'failed'] as const;
export const disputeStatusEnum = ['open', 'investigating', 'resolved', 'closed'] as const;
export const reviewStatusEnum = ['pending', 'published', 'hidden'] as const;

// Legacy/Compatibility Enums (Keep if needed for other parts of the app during transition)
export const userRolePgEnum = pgEnum('user_role', ['guest', 'owner', 'admin']);
export const verificationStatusPgEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);
export const idTypeEnum = pgEnum('id_type', ['citizenship', 'national_id_card', 'passport']);
