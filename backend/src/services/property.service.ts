import { db } from '@/db/index';
import { properties, propertyUnits, propertyMedia } from '@/db/schema/index';
import { eq, sql, gte, lte, and, desc } from 'drizzle-orm';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export const PropertyService = {
    /**
     * Advanced Search with Filtering & Availability
     */
    async search(params: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
    }) {
        const { location, minPrice, maxPrice, type, guests } = params;

        const conditions = [];

        if (location && location !== 'all') {
            const sanitized = location.toLowerCase().replace(/[%_]/g, '\\$&');
            conditions.push(
                sql`lower(${properties.city}) LIKE ${`%${sanitized}%`} OR lower(${properties.address_line}) LIKE ${`%${sanitized}%`} OR lower(${properties.district}) LIKE ${`%${sanitized}%`}`
            );
        }

        if (type && type !== 'all') {
            conditions.push(eq(properties.type, type as any));
        }

        if (minPrice) {
            conditions.push(gte(properties.base_price, minPrice));
        }

        if (maxPrice) {
            conditions.push(lte(properties.base_price, maxPrice));
        }

        if (guests) {
            conditions.push(gte(properties.max_guests, guests));
        }

        return await db.query.properties.findMany({
            where: and(...conditions),
            with: {
                media: true,
                units: true,
            },
            orderBy: desc(properties.created_at)
        });
    },

    async getAll() {
        return this.search({});
    },

    async getById(id: string) {
        const result = await db.query.properties.findFirst({
            where: eq(properties.id, id),
            with: {
                units: true,
                media: true,
            },
        });
        return result || null;
    },

    async create(data: typeof properties.$inferInsert & { units?: typeof propertyUnits.$inferInsert[]; images?: string[] }) {
        return await db.transaction(async (tx) => {
            const baseSlug = slugify(data.name, { lower: true, strict: true });
            const slug = `${baseSlug}-${uuidv4().slice(0, 8)}`;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { units, images, ...propertyData } = data as any;

            const [newProperty] = await tx.insert(properties).values({
                ...propertyData,
                slug,
            }).returning();

            if (units && units.length > 0) {
                const unitsWithPropertyId = units.map((unit: typeof propertyUnits.$inferInsert) => ({
                    ...unit,
                    property_id: newProperty.id,
                }));
                await tx.insert(propertyUnits).values(unitsWithPropertyId);
            }

            if (images && images.length > 0) {
                const mediaRecords = images.map((url: string, index: number) => ({
                    property_id: newProperty.id,
                    url,
                    type: 'image' as const,
                    sort_order: index,
                    is_cover: index === 0,
                }));
                await tx.insert(propertyMedia).values(mediaRecords);
            }

            return newProperty;
        });
    },

    async update(id: string, data: Partial<typeof properties.$inferInsert>) {
        const result = await db
            .update(properties)
            .set({ ...data, updated_at: new Date() })
            .where(eq(properties.id, id))
            .returning();
        return result[0];
    },

    async delete(id: string) {
        const result = await db
            .update(properties)
            .set({ status: 'archived', updated_at: new Date(), deleted_at: new Date() })
            .where(eq(properties.id, id))
            .returning();
        return result[0];
    },
};
