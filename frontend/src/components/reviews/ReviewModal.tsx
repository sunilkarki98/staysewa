"use client";

import { useState } from "react";
import { Star, X } from "@phosphor-icons/react";
import { ReviewsService } from "@/services/reviews.service";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    stayName: string;
    onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, bookingId, stayName, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await ReviewsService.create({
                bookingId,
                rating,
                comment,
            });
            onSuccess?.();
            onClose();
            // Reset form
            setRating(5);
            setComment("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate your stay</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    How was your stay at <span className="font-semibold text-gray-900 dark:text-white">{stayName}</span>?
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    size={32}
                                    weight={star <= rating ? "fill" : "regular"}
                                    className={star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Share your experience
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-stone-50 dark:bg-gray-800 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="What did you like? What could be improved?"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
