import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Property } from "../types/property";
import type { BackendResponse } from "../api/types";
import type { PropertyFilters } from "../hooks/useProperties";

export const PropertyService = {
    getAll: async (filters?: PropertyFilters): Promise<Property[]> => {
        const query = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.append(key, String(value));
                }
            });
        }

        const endpoint = query.toString()
            ? `${API_CONFIG.ENDPOINTS.PROPERTIES.LIST}?${query.toString()}`
            : API_CONFIG.ENDPOINTS.PROPERTIES.LIST;

        const response = await apiClient.get<BackendResponse<{ properties: Property[] }>>(endpoint);

        return response.data.properties.map(p => ({
            ...p,
            base_price: p.base_price / 100 // Paisa to Rupees
        })) || [];
    },

    getById: async (id: string): Promise<Property> => {
        const response = await apiClient.get<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.DETAILS(id)
        );
        const property = response.data.property;
        return {
            ...property,
            base_price: property.base_price / 100 // Paisa to Rupees
        };
    },

    create: async (data: Partial<Property>): Promise<Property> => {
        const payload = { ...data };
        if (payload.base_price) payload.base_price = Math.round(Number(payload.base_price) * 100);

        const response = await apiClient.post<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.CREATE,
            payload
        );
        return response.data.property;
    },

    update: async (id: string, data: Partial<Property>): Promise<Property> => {
        const payload = { ...data };
        if (payload.base_price) payload.base_price = Math.round(Number(payload.base_price) * 100);

        const response = await apiClient.patch<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.UPDATE(id),
            payload
        );
        return response.data.property;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_CONFIG.ENDPOINTS.PROPERTIES.DELETE(id));
    },
};
