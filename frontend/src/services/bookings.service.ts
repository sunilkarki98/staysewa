import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Booking, BookingStatus } from "../types/booking";
import type { BackendResponse } from "../api/types";

export const BookingsService = {
    getAll: async (): Promise<Booking[]> => {
        const response = await apiClient.get<BackendResponse<{ bookings: Booking[] }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.LIST
        );
        return response.data.bookings;
    },

    getById: async (id: string): Promise<Booking> => {
        const response = await apiClient.get<BackendResponse<{ booking: Booking }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.DETAILS(id)
        );
        return response.data.booking;
    },

    create: async (data: {
        property_id: string;
        unit_id?: string;
        check_in: string;
        check_out: string;
        guest_name: string;
        guest_email: string;
        guest_phone: string;
        total_amount?: number;
        special_requests?: string;
        guests_count?: number;
    }): Promise<Booking> => {
        // Ensure total_amount is in Paisa if provided
        const payload = { ...data };
        if (payload.total_amount) payload.total_amount = Math.round(payload.total_amount * 100);

        const response = await apiClient.post<BackendResponse<{ booking: Booking }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.CREATE,
            payload
        );
        return response.data.booking;
    },

    updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
        const response = await apiClient.patch<BackendResponse<{ booking: Booking }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
            { status }
        );
        return response.data.booking;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        const response = await apiClient.get<BackendResponse<{ bookings: Booking[] }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.MY
        );
        return response.data.bookings;
    },
};
