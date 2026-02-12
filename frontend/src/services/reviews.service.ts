import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";

interface BackendResponse<T> {
    status: string;
    data: T;
}

export const ReviewsService = {
    create: async (data: { booking_id: string; rating: number; comment: string }) => {
        const response = await apiClient.post<BackendResponse<{ review: unknown }>>(
            API_CONFIG.ENDPOINTS.REVIEWS.CREATE,
            data
        );
        return response.data;
    },

    getByProperty: async (propertyId: string) => {
        const response = await apiClient.get<BackendResponse<{ reviews: unknown[], stats: unknown }>>(
            API_CONFIG.ENDPOINTS.REVIEWS.BY_PROPERTY(propertyId)
        );
        return response.data;
    }
};
