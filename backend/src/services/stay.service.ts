import { db } from '@/db/index';
import { stays, stayUnits, stayMedia } from '@/db/schema/index';
import { eq, sql, gte, lte, and, desc, ilike } from 'drizzle-orm';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export const StaysService = {
    /**
     * Advanced Search with Filtering & Availability
     */
    async search(params: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: string; // 'apartment' | 'hostel' | 'homestay'
        checkIn?: string;
        checkOut?: string;
        guests?: number;
    }) {
        const { location, minPrice, maxPrice, type, guests } = params;

        // Build where clause
        const conditions = [];

        if (location && location !== 'all') {
            // Sanitize LIKE metacharacters to prevent search injection
            const sanitized = location.toLowerCase().replace(/[%_]/g, '\\$&');
            conditions.push(
                sql`lower(${stays.city}) LIKE ${`%${sanitized}%`} OR lower(${stays.addressLine}) LIKE ${`%${sanitized}%`} OR lower(${stays.district}) LIKE ${`%${sanitized}%`}`
            );
        }

        if (type && type !== 'all') {
            conditions.push(eq(stays.type, type as any));
        }

        if (minPrice) {
            conditions.push(gte(stays.basePrice, minPrice));
        }

        if (maxPrice) {
            conditions.push(lte(stays.basePrice, maxPrice));
        }

        if (guests) {
            // Use stays.maxGuests for simplified top-level filtering
            conditions.push(gte(stays.maxGuests, guests));
        }

        // TODO: Date overlap logic (requires checking/joining bookings)
        // For now, simpler filtering first.

        return await db.query.stays.findMany({
            where: and(...conditions),
            with: {
                stayMedia: true, // Need image for cards
                stayUnits: true, // Need units for price range maybe
            },
            orderBy: desc(stays.createdAt) // Default sort
        });
    },

    // Legacy support (optional, or redirect to search)
    async getAll() {
        return this.search({});
    },

    async getById(id: string) {
        // Use query builder to fetch relations
        const result = await db.query.stays.findFirst({
            where: eq(stays.id, id),
            with: {
                stayUnits: true,
                stayMedia: true,
            },
        });
        return result || null;
    },

    async create(data: typeof stays.$inferInsert & { stayUnits?: typeof stayUnits.$inferInsert[]; images?: string[] }) {
        return await db.transaction(async (tx) => {
            // 1. Generate Slug
            const baseSlug = slugify(data.name, { lower: true, strict: true });
            const slug = `${baseSlug}-${uuidv4().slice(0, 8)}`;

            // 2. Separate units and images from main stay data
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { stayUnits: units, images, ...stayData } = data;

            // 3. Insert Stay
            const [newStay] = await tx.insert(stays).values({
                ...stayData,
                slug,
            }).returning();

            // 4. Insert Units (if any)
            if (units && units.length > 0) {
                const unitsWithStayId = units.map(unit => ({
                    ...unit,
                    stayId: newStay.id,
                }));
                await tx.insert(stayUnits).values(unitsWithStayId);
            }

            // 5. Insert Images (if any)
            if (images && images.length > 0) {
                const mediaRecords = images.map((url, index) => ({
                    stayId: newStay.id,
                    url,
                    type: 'image' as const,
                    sortOrder: index,
                    isCover: index === 0, // First image is cover
                }));
                await tx.insert(stayMedia).values(mediaRecords);
            }

            return newStay;
        });
    },

    async update(id: string, data: Partial<typeof stays.$inferInsert>) {
        const result = await db
            .update(stays)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(stays.id, id))
            .returning();
        return result[0];
    },

    async delete(id: string) {
        // Soft delete: archive instead of destroying financial history
        const result = await db
            .update(stays)
            .set({ status: 'archived', updatedAt: new Date() })
            .where(eq(stays.id, id))
            .returning();
        return result[0];
    },
};
