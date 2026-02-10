import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import { MockAdapter } from "../api/mock";
import { Stay } from "../types/stay";
import { Booking, BookingStatus } from "../types/booking";

// Helper to switch between Real and Mock
const request = {
    get: <T>(url: string) =>
        API_CONFIG.MOCK_ENABLED ? MockAdapter.get<T>(url) : apiClient.get<T>(url),
    post: <T>(url: string, data: any) =>
        API_CONFIG.MOCK_ENABLED ? MockAdapter.post<T>(url, data) : apiClient.post<T>(url, data),
    delete: (url: string) =>
        API_CONFIG.MOCK_ENABLED ? MockAdapter.delete(url) : apiClient.delete<void>(url),
};

export const StaysService = {
    getAll: async (): Promise<Stay[]> => {
        // Backend returns { status: 'success', data: { stays: [...] } }
        const response = await request.get<{ data: { stays: any[] } }>(API_CONFIG.ENDPOINTS.STAYS.LIST);

        // Map backend fields to frontend model if necessary
        return response.data.stays.map((stay: any) => ({
            ...stay,
            // Ensure types match
            price: Number(stay.price),
            rating: Number(stay.rating || 0),
        }));
    },

    getById: async (id: string): Promise<Stay> => {
        const response = await request.get<{ data: { stay: any } }>(API_CONFIG.ENDPOINTS.STAYS.DETAILS(id));
        const stay = response.data.stay;
        return {
            ...stay,
            price: Number(stay.price),
            rating: Number(stay.rating || 0),
        };
    },

    delete: async (id: string): Promise<void> => {
        return request.delete(API_CONFIG.ENDPOINTS.STAYS.DELETE(id));
    }
};

export const StatsService = {
    getDashboardStats: async () => {
        // Dashboard stats endpoint might not be ready in backend, check if it fails gracefully or use mock if needed
        // For now, let's keep it mocked or try to fetch
        if (API_CONFIG.MOCK_ENABLED) {
            return request.get<any[]>(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);
        }
        // If backend doesn't have it, return empty or implement it. 
        // Backend doesn't have /dashboard/stats implemented yet.
        return [];
    }
};

export const BookingsService = {
    getAll: async (): Promise<Booking[]> => {
        const response = await request.get<{ data: { bookings: any[] } }>(API_CONFIG.ENDPOINTS.BOOKINGS.LIST);

        return response.data.bookings.map((b: any) => ({
            id: b.id,
            guest: b.guestName || "Unknown Guest", // Map guestName -> guest
            email: b.guestEmail || "",
            phone: b.guestPhone || "",
            property: b.stayName || "Unknown Property", // Map stayName -> property
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: b.status,
            amount: Number(b.totalAmount), // Map totalAmount -> amount
        }));
    },

    updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
        const response = await request.post<{ data: { booking: any } }>(API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), { status });
        const b = response.data.booking;

        // Return mapped object
        return {
            id: b.id,
            guest: b.guestName || "Unknown Guest",
            email: b.guestEmail || "",
            phone: b.guestPhone || "",
            property: b.stayName || "Unknown Property", // Note: Update response might not have joined stayName, handle this
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: b.status,
            amount: Number(b.totalAmount),
        };
    }
};
