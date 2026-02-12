import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { User } from "../types/user";
import type { BackendResponse } from "../api/types";

export const UsersService = {
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<BackendResponse<{ user: unknown }>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE
        );
        return response.data.user as User;
    },

    updateProfile: async (data: { name?: string; phone?: string }): Promise<User> => {
        const response = await apiClient.patch<BackendResponse<{ user: unknown }>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE,
            data
        );
        return response.data.user as User;
    },
};
