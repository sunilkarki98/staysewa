import { pgTable, text, uuid, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { properties } from '@/db/schema/properties';
import { bookings } from '@/db/schema/bookings';
import { reviews } from '@/db/schema/reviews';
import { favorites, notifications } from '@/db/schema/social';
import { payouts } from '@/db/schema/bookings'; // Will update payouts later

/* ───── USERS ───── */
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    full_name: text('full_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    avatar_url: text('avatar_url'),
    role: text('role').default('guest').notNull(),

    // Auth Integration
    password: text('password'), // Retaining for existing auth

    // Verification
    email_verified: boolean('email_verified').default(false),
    phone_verified: boolean('phone_verified').default(false),
    id_verified: boolean('id_verified').default(false),
    verification_status: text('verification_status').default('pending'),

    // Profile
    bio: text('bio'),
    language: text('language').default('en'),
    timezone: text('timezone').default('Asia/Kathmandu'),

    // Settings
    notification_preferences: jsonb('notification_preferences').default({}),

    // Security
    is_active: boolean('is_active').default(true),
    blocked_at: timestamp('blocked_at', { withTimezone: true }),
    blocked_reason: text('blocked_reason'),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    email_idx: index('users_email_idx').on(table.email),
    role_idx: index('users_role_idx').on(table.role)
}));

/* ───── USER VERIFICATION DOCUMENTS ───── */
export const userVerificationDocuments = pgTable('user_verification_documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    document_type: text('document_type').notNull(), // citizenship, passport, license
    document_number: text('document_number'),
    front_image_url: text('front_image_url').notNull(),
    back_image_url: text('back_image_url'),
    selfie_url: text('selfie_url'),
    status: text('status').default('pending').notNull(),
    reviewed_by: uuid('reviewed_by').references(() => users.id),
    reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
    rejection_reason: text('rejection_reason'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    user_idx: index('verification_user_idx').on(table.user_id)
}));

/* ───── RELATIONS ───── */
export const usersRelations = relations(users, ({ many }) => ({
    ownedProperties: many(properties),
    bookingsAsCustomer: many(bookings, { relationName: 'customer' }),
    bookingsAsOwner: many(bookings, { relationName: 'owner' }),
    reviews: many(reviews),
    favorites: many(favorites),
    notifications: many(notifications),
    payouts: many(payouts),
    verificationDocuments: many(userVerificationDocuments)
}));

export const userVerificationDocumentsRelations = relations(userVerificationDocuments, ({ one }) => ({
    user: one(users, { fields: [userVerificationDocuments.user_id], references: [users.id] }),
    reviewer: one(users, { fields: [userVerificationDocuments.reviewed_by], references: [users.id] })
}));
