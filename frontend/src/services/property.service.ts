import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Property } from "../types/property";
import type { BackendResponse } from "../api/types";

export const PropertyService = {
    getAll: async (filters?: Record<string, any>): Promise<Property[]> => {
        const query = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                    // Map frontend keys to backend snake_case if necessary
                    const backendKey = key === 'category' ? 'type' : key;
                    query.append(backendKey, String(value));
                }
            });
        }

        const response = await apiClient.get<BackendResponse<{ properties: Property[] }>>(
            `${API_CONFIG.ENDPOINTS.PROPERTIES.LIST}?${query.toString()}`
        );
        return response.data.properties;
    },

    getById: async (id: string): Promise<Property> => {
        const response = await apiClient.get<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.DETAILS(id)
        );
        return response.data.property;
    },

    create: async (data: Partial<Property>): Promise<Property> => {
        const response = await apiClient.post<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.CREATE,
            data
        );
        return response.data.property;
    },

    update: async (id: string, data: Partial<Property>): Promise<Property> => {
        const response = await apiClient.patch<BackendResponse<{ property: Property }>>(
            API_CONFIG.ENDPOINTS.PROPERTIES.UPDATE(id),
            data
        );
        return response.data.property;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_CONFIG.ENDPOINTS.PROPERTIES.DELETE(id));
    },
};
