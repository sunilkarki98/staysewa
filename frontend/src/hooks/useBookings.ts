import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingsService } from "../services/domain";
import type { Booking, BookingStatus } from "../types/booking";
import type { ApiError } from "../api/types";

export function useBookings() {
    const queryClient = useQueryClient();

    const {
        data: bookings = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Booking[], ApiError>({
        queryKey: ["bookings"],
        queryFn: BookingsService.getAll,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
            BookingsService.updateStatus(id, status),
        onSuccess: (updatedBooking) => {
            queryClient.setQueryData<Booking[]>(["bookings"], (old) =>
                old ? old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)) : []
            );
        },
    });

    return {
        bookings,
        loading,
        error,
        refresh,
        updateStatus: async (id: string, status: BookingStatus) => {
            try {
                return await updateStatusMutation.mutateAsync({ id, status });
            } catch {
                return false;
            }
        },
    };
}
