import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { BackendResponse } from "../api/types";

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
