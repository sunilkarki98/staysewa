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

    getByStay: async (stayId: string) => {
        const response = await apiClient.get<BackendResponse<{ media: unknown[] }>>(
            API_CONFIG.ENDPOINTS.MEDIA.BY_STAY(stayId)
        );
        return response.data.media;
    },
};
