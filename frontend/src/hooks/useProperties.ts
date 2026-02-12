import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyService } from "../services/domain";
import type { Property } from "../types/property";
import type { ApiError } from "../api/types";

export type PropertyFilters = {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
};

export function useProperties(filters?: PropertyFilters) {
    const queryClient = useQueryClient();

    const {
        data: properties = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Property[], ApiError>({
        queryKey: ["properties", filters],
        queryFn: () => PropertyService.getAll(filters),
    });

    const deleteMutation = useMutation({
        mutationFn: PropertyService.delete,
        onSuccess: (_, id) => {
            queryClient.setQueryData<Property[]>(["properties"], (old) =>
                old ? old.filter((p) => p.id !== id) : []
            );
        },
    });

    const createMutation = useMutation({
        mutationFn: PropertyService.create,
        onSuccess: (newProperty) => {
            queryClient.setQueryData<Property[]>(["properties"], (old) =>
                old ? [newProperty, ...old] : [newProperty]
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
            PropertyService.update(id, data),
        onSuccess: (updatedProperty) => {
            queryClient.setQueryData<Property[]>(["properties"], (old) =>
                old ? old.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)) : []
            );
        },
    });

    return {
        properties,
        loading,
        error,
        refresh,
        deleteProperty: async (id: string) => {
            try {
                await deleteMutation.mutateAsync(id);
                return true;
            } catch {
                return false;
            }
        },
        createProperty: async (data: Partial<Property>) => {
            return await createMutation.mutateAsync(data);
        },
        updateProperty: async (id: string, data: Partial<Property>) => {
            try {
                return await updateMutation.mutateAsync({ id, data });
            } catch {
                return null;
            }
        },
    };
}
