import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Stay } from "../types/stay";
import type { BackendResponse } from "../api/types";

export const StaysService = {
    getAll: async (filters?: Record<string, any>): Promise<Stay[]> => {
        const query = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                    query.append(key, String(value));
                }
            });
        }

        const response = await apiClient.get<BackendResponse<{ stays: unknown[] }>>(
            `${API_CONFIG.ENDPOINTS.STAYS.LIST}?${query.toString()}`
        );
        return response.data.stays.map(mapStay);
    },

    getById: async (id: string): Promise<Stay> => {
        const response = await apiClient.get<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.DETAILS(id)
        );
        return mapStay(response.data.stay);
    },

    create: async (data: Partial<Stay>): Promise<Stay> => {
        const response = await apiClient.post<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.CREATE,
            data
        );
        return mapStay(response.data.stay);
    },

    update: async (id: string, data: Partial<Stay>): Promise<Stay> => {
        const response = await apiClient.patch<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.UPDATE(id),
            data
        );
        return mapStay(response.data.stay);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_CONFIG.ENDPOINTS.STAYS.DELETE(id));
    },
};

function mapStay(raw: unknown): Stay {
    const r = raw as Record<string, unknown>;
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(r as any),
        price: Number(r.price),
        rating: Number(r.rating || 0),
        images: (r.images as string[]) || [],
    };
}
