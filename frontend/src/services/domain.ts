import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { Stay } from "../types/stay";
import type { Booking, BookingStatus } from "../types/booking";

// ─── Backend Response Shapes ─────────────────────────────────────────────────

interface BackendResponse<T> {
    status: string;
    data: T;
    results?: number;
}

// ─── Stays Service ───────────────────────────────────────────────────────────

export const StaysService = {
    getAll: async (): Promise<Stay[]> => {
        const response = await apiClient.get<BackendResponse<{ stays: unknown[] }>>(
            API_CONFIG.ENDPOINTS.STAYS.LIST
        );
        return response.data.stays.map(mapStay);
    },

    getById: async (id: string): Promise<Stay> => {
        const response = await apiClient.get<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.DETAILS(id)
        );
        return mapStay(response.data.stay);
    },

    create: async (data: Partial<Stay>): Promise<Stay> => {
        const response = await apiClient.post<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.CREATE,
            data
        );
        return mapStay(response.data.stay);
    },

    update: async (id: string, data: Partial<Stay>): Promise<Stay> => {
        const response = await apiClient.patch<BackendResponse<{ stay: unknown }>>(
            API_CONFIG.ENDPOINTS.STAYS.UPDATE(id),
            data
        );
        return mapStay(response.data.stay);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_CONFIG.ENDPOINTS.STAYS.DELETE(id));
    },
};

function mapStay(raw: unknown): Stay {
    const r = raw as Record<string, unknown>;
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(r as any),
        price: Number(r.price),
        rating: Number(r.rating || 0),
        images: (r.images as string[]) || [],
    };
}

// ─── Bookings Service ────────────────────────────────────────────────────────

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
    };
}

// ─── Dashboard / Stats Service ───────────────────────────────────────────────

export interface DashboardStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
}

export interface Activity {
    id: string | number;
    type: string;
    message: string;
    time: string;
    status: string;
}

export const StatsService = {
    getDashboardStats: async (): Promise<DashboardStat[]> => {
        try {
            const response = await apiClient.get<BackendResponse<{ stats: unknown }>>(
                API_CONFIG.ENDPOINTS.DASHBOARD.STATS
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const s = response.data.stats as any;
            return [
                {
                    title: "Total Revenue",
                    value: `Rs ${s.totalRevenue?.toLocaleString() || "0"}`,
                    change: `${s.revenueChange || 0}%`,
                    trend: (s.revenueChange || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Active Listings",
                    value: String(s.activeListings || 0),
                    change: `${s.listingsChange || 0}%`,
                    trend: (s.listingsChange || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Total Bookings",
                    value: String(s.totalBookings || 0),
                    change: `${s.bookingsChange || 0}%`,
                    trend: (s.bookingsChange || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Page Views",
                    value: String(s.pageViews || 0),
                    change: `${s.viewsChange || 0}%`,
                    trend: (s.viewsChange || 0) >= 0 ? "up" : "down",
                },
            ];
        } catch {
            return [];
        }
    },

    getRecentActivity: async (): Promise<Activity[]> => {
        try {
            const response = await apiClient.get<BackendResponse<{ activity: Activity[] }>>(
                API_CONFIG.ENDPOINTS.DASHBOARD.ACTIVITY
            );
            return response.data.activity;
        } catch {
            return [];
        }
    },
};

// ─── Payments Service ────────────────────────────────────────────────────────

export interface PaymentInitResponse {
    paymentUrl: string;
    pidx: string;
}

export interface PaymentVerifyResponse {
    status: string;
    transactionId: string;
}

export const PaymentsService = {
    initiate: async (bookingId: string, amount: number): Promise<PaymentInitResponse> => {
        const response = await apiClient.post<BackendResponse<PaymentInitResponse>>(
            API_CONFIG.ENDPOINTS.PAYMENTS.INITIATE,
            { bookingId, amount }
        );
        return response.data;
    },

    verify: async (pidx: string): Promise<PaymentVerifyResponse> => {
        const response = await apiClient.post<BackendResponse<PaymentVerifyResponse>>(
            API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY,
            { pidx }
        );
        return response.data;
    },
};

// ─── Media Service ───────────────────────────────────────────────────────────

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

// ─── Users Service ───────────────────────────────────────────────────────────

export const UsersService = {
    getProfile: async () => {
        const response = await apiClient.get<BackendResponse<{ user: unknown }>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE
        );
        return response.data.user;
    },

    updateProfile: async (data: { name?: string; phone?: string }) => {
        const response = await apiClient.patch<BackendResponse<{ user: unknown }>>(
            API_CONFIG.ENDPOINTS.USERS.PROFILE,
            data
        );
        return response.data.user;
    },
};
