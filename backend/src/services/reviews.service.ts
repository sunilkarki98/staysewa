import { db } from '@/db';
import { reviews, bookings, users } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { AppError } from '@/utils/AppError';

export const ReviewsService = {
    // Create a review
    async create(data: { booking_id: string; overall_rating: number; comment?: string; reviewer_id: string }) {
        // 1. Verify booking exists and belongs to user
        const booking = await db.query.bookings.findFirst({
            where: and(
                eq(bookings.id, data.booking_id),
                eq(bookings.customer_id, data.reviewer_id)
            )
        });

        if (!booking) {
            throw new AppError('Booking not found or access denied', 404);
        }

        // 2. Verify booking is completed (ideally status='completed')

        // 3. Check if review already exists
        const existing = await db.query.reviews.findFirst({
            where: eq(reviews.booking_id, data.booking_id)
        });

        if (existing) {
            throw new AppError('You have already reviewed this stay', 400);
        }

        // 4. Create review
        const [review] = await db.insert(reviews).values({
            booking_id: data.booking_id,
            property_id: booking.property_id,
            reviewer_id: data.reviewer_id,
            overall_rating: data.overall_rating,
            comment: data.comment,
            status: 'approved' // Automatically approve for now or set to 'pending'
        }).returning();

        return review;
    },

    // Get reviews for a property
    async getByProperty(property_id: string) {
        return await db.query.reviews.findMany({
            where: eq(reviews.property_id, property_id),
            orderBy: [desc(reviews.created_at)],
            with: {
                reviewer: {
                    columns: {
                        full_name: true,
                        avatar_url: true
                    }
                }
            }
        });
    },

    // Get stats for a property
    async getStats(property_id: string) {
        const stats = await db
            .select({
                averageRating: sql<string>`avg(${reviews.overall_rating})::numeric(10,1)`,
                count: sql<number>`count(*)`
            })
            .from(reviews)
            .where(eq(reviews.property_id, property_id));

        return stats[0] || { averageRating: '0', count: 0 };
    }
};

