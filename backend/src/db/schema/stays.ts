import { pgTable, text, uuid, timestamp, boolean, integer, numeric, jsonb, time, date, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { stayTypeEnum, stayIntentEnum, stayStatusEnum, unitTypeEnum, availabilityStatusEnum, mediaTypeEnum, cancellationTypeEnum, priceRuleTypeEnum, adjustmentTypeEnum } from '@/db/schema/enums';

// ─── Stays (Property Listing) ────────────────────────────────
export const stays = pgTable('stays', {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: uuid('owner_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(), // URL-friendly slug
    description: text('description'),
    type: stayTypeEnum('type').notNull(),
    intent: stayIntentEnum('intent').default('both'),
    status: stayStatusEnum('status').default('draft'),

    // Location
    addressLine: text('address_line').notNull(),
    city: text('city').notNull(),
    district: text('district').notNull(),
    province: text('province'),
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),

    // Pricing & Rules
    basePrice: integer('base_price').notNull(), // in Paisa
    maxGuests: integer('max_guests').default(2),
    amenities: jsonb('amenities').default([]), // ["wifi", "parking"]
    rules: jsonb('rules').default([]), // ["no_smoking"]
    checkInTime: time('check_in_time').default('14:00:00'),
    checkOutTime: time('check_out_time').default('11:00:00'),

    // Stats (Denormalized/Cached)
    avgRating: numeric('avg_rating', { precision: 2, scale: 1 }).default('0'),
    totalReviews: integer('total_reviews').default(0),
    totalBookings: integer('total_bookings').default(0),
    isFeatured: boolean('is_featured').default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    ownerIdIdx: index('stay_owner_id_idx').on(table.ownerId),
}));

// ─── Stay Units (Rooms/Beds) ────────────────────────────────
export const stayUnits = pgTable('stay_units', {
    id: uuid('id').defaultRandom().primaryKey(),
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    name: text('name').notNull(), // "Deluxe Room"
    type: unitTypeEnum('type').notNull(),
    maxOccupancy: integer('max_occupancy').default(2).notNull(),
    basePrice: integer('base_price').notNull(), // Unit-specific price
    quantity: integer('quantity').default(1),
    amenities: jsonb('amenities').default([]),
    isActive: boolean('is_active').default(true),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    stayIdIdx: index('stay_unit_stay_id_idx').on(table.stayId),
}));

// ─── Availability Calendar (Per Unit Per Day) ───────────────
export const availability = pgTable('availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    unitId: uuid('unit_id').references(() => stayUnits.id).notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    availableCount: integer('available_count').notNull(),
    priceOverride: integer('price_override'), // Seasonal daily price
    minNights: integer('min_nights').default(1),
    status: availabilityStatusEnum('status').default('available'),
}, (t) => ({
    unq: uniqueIndex('availability_unit_date_idx').on(t.unitId, t.date),
}));
// Note: Composite unique index on (unit_id, date) should be added in migration

// ─── Stay Media (Photos/Videos) ─────────────────────────────
export const stayMedia = pgTable('stay_media', {
    id: uuid('id').defaultRandom().primaryKey(),
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    unitId: uuid('unit_id').references(() => stayUnits.id), // Optional: link photo to specific unit
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    type: mediaTypeEnum('type').default('image'),
    caption: text('caption'),
    sortOrder: integer('sort_order').default(0),
    isCover: boolean('is_cover').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Cancellation Policies ──────────────────────────────────
export const cancellationPolicies = pgTable('cancellation_policies', {
    id: uuid('id').defaultRandom().primaryKey(),
    stayId: uuid('stay_id').references(() => stays.id).unique(),
    type: cancellationTypeEnum('type').default('moderate'),
    freeCancelHours: integer('free_cancel_hours').default(48),
    refundPercentBefore: integer('refund_percent_before').default(100),
    refundPercentAfter: integer('refund_percent_after').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Price Rules (Seasonal / Weekend) ───────────────────────
export const priceRules = pgTable('price_rules', {
    id: uuid('id').defaultRandom().primaryKey(),
    stayId: uuid('stay_id').references(() => stays.id).notNull(),
    unitId: uuid('unit_id').references(() => stayUnits.id), // Optional: apply to specific unit
    name: text('name').notNull(),
    type: priceRuleTypeEnum('type').notNull(),
    adjustmentType: adjustmentTypeEnum('adjustment_type').notNull(),
    adjustmentValue: integer('adjustment_value').notNull(),
    startDate: date('start_date', { mode: 'string' }),
    endDate: date('end_date', { mode: 'string' }),
    daysOfWeek: jsonb('days_of_week'), // [0, 6] for Sun/Sat
    minNights: integer('min_nights'),
    isActive: boolean('is_active').default(true),
    priority: integer('priority').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Reviews ────────────────────────────────────────────────
// Circular reference: Reviews need Bookings, but Bookings need Stays.
// Solving by importing `bookings` from bookings.ts later, but for now we reference schema by name
// or define reviews in bookings.ts? Better to keep reviews here near Stays or in separate file.
// Let's keep reviews here but use booking_id as reference without strict TS import cycle if possible.
// Actually, circular imports in Drizzle are tricky. Let's verify.
// In Drizzle, table references function lazily `() => table`.
// So we can import bookings.ts even if bookings.ts imports stays.ts.

// ─── Relations ──────────────────────────────────────────────

export const staysRelations = relations(stays, ({ many }) => ({
    stayUnits: many(stayUnits),
    stayMedia: many(stayMedia),
}));

export const stayUnitsRelations = relations(stayUnits, ({ one }) => ({
    stay: one(stays, {
        fields: [stayUnits.stayId],
        references: [stays.id],
    }),
}));

export const stayMediaRelations = relations(stayMedia, ({ one }) => ({
    stay: one(stays, {
        fields: [stayMedia.stayId],
        references: [stays.id],
    }),
}));
