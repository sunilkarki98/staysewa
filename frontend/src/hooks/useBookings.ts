import { useState, useEffect, useCallback } from "react";
import { BookingsService } from "../services/domain";
import { Booking, BookingStatus } from "../types/booking";
import { ApiError } from "../api/types";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await BookingsService.getAll();
            setBookings(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateStatus = async (id: string, status: BookingStatus) => {
        try {
            // Optimistic update
            setBookings((prev) =>
                prev.map((b) => b.id === id ? { ...b, status } : b)
            );

            await BookingsService.updateStatus(id, status);
            return true;
        } catch (err) {
            // Revert on error
            setError(err as ApiError);
            fetchBookings(); // Refresh to ensure sync
            return false;
        }
    };

    return {
        bookings,
        loading,
        error,
        refresh: fetchBookings,
        updateStatus
    };
}
