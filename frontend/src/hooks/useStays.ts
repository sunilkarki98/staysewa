import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StaysService } from "../services/domain";
import type { Stay } from "../types/stay";
import type { ApiError } from "../api/types";

export type StayFilters = {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
};

export function useStays(filters?: StayFilters) {
    const queryClient = useQueryClient();

    const {
        data: stays = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Stay[], ApiError>({
        // Include filters in queryKey for automatic refetching
        queryKey: ["stays", filters],
        queryFn: () => StaysService.getAll(filters),
    });

    const deleteMutation = useMutation({
        mutationFn: StaysService.delete,
        onSuccess: (_, id) => {
            queryClient.setQueryData<Stay[]>(["stays"], (old) =>
                old ? old.filter((stay) => stay.id !== id) : []
            );
        },
    });

    const createMutation = useMutation({
        mutationFn: StaysService.create,
        onSuccess: (newStay) => {
            queryClient.setQueryData<Stay[]>(["stays"], (old) =>
                old ? [newStay, ...old] : [newStay]
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Stay> }) =>
            StaysService.update(id, data),
        onSuccess: (updatedStay) => {
            queryClient.setQueryData<Stay[]>(["stays"], (old) =>
                old ? old.map((s) => (s.id === updatedStay.id ? updatedStay : s)) : []
            );
        },
    });

    return {
        stays,
        loading,
        error,
        refresh,
        deleteStay: async (id: string) => {
            try {
                await deleteMutation.mutateAsync(id);
                return true;
            } catch {
                return false;
            }
        },
        createStay: async (data: Partial<Stay>) => {
            try {
                return await createMutation.mutateAsync(data);
            } catch {
                return null;
            }
        },
        updateStay: async (id: string, data: Partial<Stay>) => {
            try {
                return await updateMutation.mutateAsync({ id, data });
            } catch {
                return null;
            }
        },
    };
}
