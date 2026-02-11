import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";

interface BackendResponse<T> {
    status: string;
    data: T;
}

export const ReviewsService = {
    create: async (data: { bookingId: string; rating: number; comment: string }) => {
        const response = await apiClient.post<BackendResponse<{ review: unknown }>>(
            API_CONFIG.ENDPOINTS.REVIEWS.CREATE,
            data
        );
        return response.data;
    },

    getByStay: async (stayId: string) => {
        const response = await apiClient.get<BackendResponse<{ reviews: unknown[], stats: unknown }>>(
            API_CONFIG.ENDPOINTS.REVIEWS.BY_STAY(stayId)
        );
        return response.data;
    }
};
