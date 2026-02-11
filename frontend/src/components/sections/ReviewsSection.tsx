"use client";

import { useEffect, useState } from "react";
import { Star, UserCircle } from "@phosphor-icons/react";
import { ReviewsService } from "@/services/reviews.service";

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: {
        name: string;
    };
    createdAt: string;
}

interface Stats {
    averageRating: string;
    count: number;
}

export default function ReviewsSection({ stayId }: { stayId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<Stats>({ averageRating: "0", count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [stayId]);

    const fetchReviews = async () => {
        try {
            const data = await ReviewsService.getByStay(stayId);
            // @ts-ignore
            setReviews(data.reviews);
            // @ts-ignore
            setStats(data.stats);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="py-8 text-center text-gray-400">Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="py-8 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h3>
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to stay!</p>
            </div>
        );
    }

    return (
        <div className="py-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h3>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                    <Star weight="fill" className="text-yellow-400" />
                    <span>{stats.averageRating}</span>
                    <span className="text-gray-400 font-normal">({stats.count} reviews)</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                                <UserCircle size={32} weight="fill" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{review.user?.name || "Anonymous Guest"}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} weight={i < review.rating ? "fill" : "regular"} />
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
