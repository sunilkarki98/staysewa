import { pgTable, text, uuid, timestamp, boolean, integer, numeric, jsonb, time, date, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import { bookings } from '@/db/schema/bookings';
import { reviews } from '@/db/schema/reviews';
import { favorites } from '@/db/schema/social';
import { priceRules } from '@/db/schema/bookings'; // Will update if moved

/* ───── PROPERTIES ───── */
export const properties = pgTable('properties', {
    id: uuid('id').defaultRandom().primaryKey(),
    owner_id: uuid('owner_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    type: text('type').notNull(),
    status: text('status').default('draft').notNull(),

    // Address
    address_line: text('address_line').notNull(),
    city: text('city').notNull(),
    district: text('district').notNull(),
    province: text('province'),
    postal_code: text('postal_code'),
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),

    // Pricing
    base_price: integer('base_price').notNull(),
    currency: text('currency').default('NPR'),

    // Capacity
    max_guests: integer('max_guests').default(2),
    bedrooms: integer('bedrooms').default(0),
    bathrooms: integer('bathrooms').default(0),
    beds: integer('beds').default(0),

    // Policies
    amenities: jsonb('amenities').default([]),
    rules: jsonb('rules').default([]),
    check_in_time: time('check_in_time').default('14:00:00'),
    check_out_time: time('check_out_time').default('11:00:00'),
    min_nights: integer('min_nights').default(1),
    max_nights: integer('max_nights').default(365),
    cancellation_policy_id: uuid('cancellation_policy_id').references(() => cancellationPolicies.id),

    // Commission
    commission_rate: numeric('commission_rate', { precision: 4, scale: 2 }).default('15.00'), // Platform commission %

    // Stats
    avg_rating: numeric('avg_rating', { precision: 3, scale: 2 }).default('0'),
    total_reviews: integer('total_reviews').default(0),
    total_bookings: integer('total_bookings').default(0),
    is_featured: boolean('is_featured').default(false),
    views_count: integer('views_count').default(0),

    // SEO
    meta_title: text('meta_title'),
    meta_description: text('meta_description'),

    // Full-text search
    search_vector: text('search_vector'), // We'll use tsvector in migration

    // Flexible attributes
    attributes: jsonb('attributes').default({}),

    // Soft delete
    deleted_at: timestamp('deleted_at', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    owner_idx: index('properties_owner_idx').on(table.owner_id),
    status_idx: index('properties_status_idx').on(table.status),
    city_idx: index('properties_city_idx').on(table.city),
    type_idx: index('properties_type_idx').on(table.type),
    location_idx: index('properties_location_idx').on(table.latitude, table.longitude),
    featured_idx: index('properties_featured_idx').on(table.is_featured).where(sql`deleted_at IS NULL`),
    attr_gin_idx: index('properties_attr_gin_idx').on(table.attributes),
    deleted_idx: index('properties_deleted_idx').on(table.deleted_at)
}));

/* ───── PROPERTY UNITS ───── */
export const propertyUnits = pgTable('property_units', {
    id: uuid('id').defaultRandom().primaryKey(),
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    description: text('description'),

    max_occupancy: integer('max_occupancy').default(2).notNull(),
    base_price: integer('base_price').notNull(),
    quantity: integer('quantity').default(1).notNull(),

    amenities: jsonb('amenities').default([]),
    is_active: boolean('is_active').default(true),
    attributes: jsonb('attributes').default({}),

    // Soft delete
    deleted_at: timestamp('deleted_at', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    property_idx: index('unit_property_idx').on(table.property_id),
    active_idx: index('unit_active_idx').on(table.is_active),
    attr_gin_idx: index('unit_attr_gin_idx').on(table.attributes),
    quantity_positive: check('quantity_positive', sql`${table.quantity} >= 1`)
}));

/* ───── PROPERTY MEDIA ───── */
export const propertyMedia = pgTable('property_media', {
    id: uuid('id').defaultRandom().primaryKey(),
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
    unit_id: uuid('unit_id').references(() => propertyUnits.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    thumbnail_url: text('thumbnail_url'),
    type: text('type').default('image').notNull(),
    label: text('label'),
    alt_text: text('alt_text'),
    sort_order: integer('sort_order').default(0),
    is_cover: boolean('is_cover').default(false),
    width: integer('width'),
    height: integer('height'),
    file_size: integer('file_size'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    property_idx: index('media_property_idx').on(table.property_id),
    unit_idx: index('media_unit_idx').on(table.unit_id),
    sort_idx: index('media_sort_idx').on(table.property_id, table.sort_order)
}));

/* ───── PROPERTY FEATURES ───── */
export const propertyFeatures = pgTable('property_features', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    category: text('category'),
    icon_url: text('icon_url'),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const propertyFeaturesMapping = pgTable('property_features_mapping', {
    property_id: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
    feature_id: uuid('feature_id').references(() => propertyFeatures.id, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    pk: uniqueIndex('property_feature_pk').on(table.property_id, table.feature_id)
}));

/* ───── CANCELLATION POLICIES ───── */
export const cancellationPolicies = pgTable('cancellation_policies', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    description: text('description'),
    rules: jsonb('rules').notNull(), // [{hours_before: 48, refund_percentage: 100}, ...]
    is_default: boolean('is_default').default(false),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

/* ───── AVAILABILITY ───── */
export const availability = pgTable('availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    unit_id: uuid('unit_id').references(() => propertyUnits.id, { onDelete: 'cascade' }).notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    available_count: integer('available_count').notNull(),
    price_override: integer('price_override'),
    min_nights: integer('min_nights').default(1),
    status: text('status').default('available').notNull(),

    // Optimistic locking
    version: integer('version').default(0).notNull(),

    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
    unit_date_unique: uniqueIndex('availability_unit_date').on(table.unit_id, table.date),
    date_idx: index('availability_date_idx').on(table.date),
    status_idx: index('availability_status_idx').on(table.status),
    count_positive: check('count_positive', sql`${table.available_count} >= 0`)
}));

/* ───── RELATIONS ───── */
export const propertiesRelations = relations(properties, ({ one, many }) => ({
    owner: one(users, { fields: [properties.owner_id], references: [users.id] }),
    units: many(propertyUnits),
    media: many(propertyMedia),
    bookings: many(bookings),
    features: many(propertyFeaturesMapping),
    reviews: many(reviews),
    favorites: many(favorites),
    priceRules: many(priceRules),
    cancellationPolicy: one(cancellationPolicies, { fields: [properties.cancellation_policy_id], references: [cancellationPolicies.id] })
}));

export const propertyUnitsRelations = relations(propertyUnits, ({ one, many }) => ({
    property: one(properties, { fields: [propertyUnits.property_id], references: [properties.id] }),
    media: many(propertyMedia),
    availability: many(availability),
    bookings: many(bookings),
    priceRules: many(priceRules)
}));

export const propertyMediaRelations = relations(propertyMedia, ({ one }) => ({
    property: one(properties, { fields: [propertyMedia.property_id], references: [properties.id] }),
    unit: one(propertyUnits, { fields: [propertyMedia.unit_id], references: [propertyUnits.id] })
}));

export const propertyFeaturesMappingRelations = relations(propertyFeaturesMapping, ({ one }) => ({
    property: one(properties, { fields: [propertyFeaturesMapping.property_id], references: [properties.id] }),
    feature: one(propertyFeatures, { fields: [propertyFeaturesMapping.feature_id], references: [propertyFeatures.id] })
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
    unit: one(propertyUnits, { fields: [availability.unit_id], references: [propertyUnits.id] })
}));
