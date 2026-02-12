import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Booking, BookingStatus } from "../types/booking";
import type { BackendResponse } from "../api/types";

export const BookingsService = {
    getAll: async (): Promise<Booking[]> => {
        const response = await apiClient.get<BackendResponse<{ bookings: unknown[] }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.LIST
        );
        return response.data.bookings.map(mapBooking);
    },

    getById: async (id: string): Promise<Booking> => {
        const response = await apiClient.get<BackendResponse<{ booking: unknown }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.DETAILS(id)
        );
        return mapBooking(response.data.booking);
    },

    create: async (data: {
        stayId: string;
        unitId?: string; // Optional for flats, required for hostels
        checkIn: string;
        checkOut: string;
        guestName: string;
        guestEmail: string;
        guestPhone: string;
        totalAmount?: number; // Optional, calculated by backend usually but nice to have for reference
        specialRequests?: string;
    }): Promise<Booking> => {
        const response = await apiClient.post<BackendResponse<{ booking: unknown }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.CREATE,
            data
        );
        return mapBooking(response.data.booking);
    },

    updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
        const response = await apiClient.patch<BackendResponse<{ booking: unknown }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
            { status }
        );
        return mapBooking(response.data.booking);
    },

    getMyBookings: async (): Promise<Booking[]> => {
        const response = await apiClient.get<BackendResponse<{ bookings: unknown[] }>>(
            API_CONFIG.ENDPOINTS.BOOKINGS.MY
        );
        return response.data.bookings.map(mapBooking);
    },
};

function mapBooking(raw: unknown): Booking {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = raw as any;
    return {
        id: r.id,
        guest: r.guestName || r.guest || "Unknown Guest",
        email: r.guestEmail || r.email || "",
        phone: r.guestPhone || r.phone || "",
        property: r.stayName || r.property || "Unknown Property",
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        status: r.status,
        amount: Number(r.totalAmount || r.amount || 0),
        guestsCount: r.guestsCount,
        specialRequests: r.specialRequests,
        paymentStatus: r.paymentStatus,
        stayId: r.stayId || r.stay_id || "", // Ensure stayId is mapped
    };
}
