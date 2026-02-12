import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { BackendResponse } from "../api/types";

export const MediaService = {
    upload: async (formData: FormData) => {
        return apiClient.upload<BackendResponse<{ media: unknown }>>(
            API_CONFIG.ENDPOINTS.MEDIA.UPLOAD,
            formData
        );
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_CONFIG.ENDPOINTS.MEDIA.DELETE(id));
    },

    setCover: async (id: string) => {
        return apiClient.patch<BackendResponse<{ media: unknown }>>(
            API_CONFIG.ENDPOINTS.MEDIA.SET_COVER(id),
            {}
        );
    },

    getByProperty: async (propertyId: string) => {
        const response = await apiClient.get<BackendResponse<{ media: unknown[] }>>(
            API_CONFIG.ENDPOINTS.MEDIA.BY_PROPERTY(propertyId)
        );
        return response.data.media;
    },
};
