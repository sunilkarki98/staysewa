import { pgTable, text, uuid, timestamp, boolean, integer, date, jsonb } from 'drizzle-orm/pg-core';
import { userRoleEnum, verificationStatusEnum } from '@/db/schema/enums';

// ─── Users (Unified Auth) ───────────────────────────────────
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    phone: text('phone').unique(),
    fullName: text('full_name').notNull(),
    avatarUrl: text('avatar_url'),
    role: userRoleEnum('role').default('customer').notNull(),
    password: text('password'), // Add password field
    emailVerified: boolean('email_verified').default(false),
    phoneVerified: boolean('phone_verified').default(false),
    isActive: boolean('is_active').default(true),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── Owner Profiles ─────────────────────────────────────────
export const ownerProfiles = pgTable('owner_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    businessName: text('business_name'),
    panNumber: text('pan_number'),
    citizenshipNumber: text('citizenship_number'),
    bankName: text('bank_name'),
    bankAccount: text('bank_account'),
    address: text('address'),
    verificationStatus: verificationStatusEnum('verification_status').default('pending'),
    totalEarnings: integer('total_earnings').default(0), // stored in paisa
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Customer Profiles ──────────────────────────────────────
export const customerProfiles = pgTable('customer_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    dateOfBirth: date('date_of_birth'),
    nationality: text('nationality').default('Nepali'),
    idType: text('id_type'),
    idNumber: text('id_number'),
    emergencyContact: text('emergency_contact'),
    preferences: jsonb('preferences').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── User Sessions (Optional, if not using Supabase Auth only) ─
export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
