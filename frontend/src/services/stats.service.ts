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
                    value: `Rs ${(s.total_revenue || 0).toLocaleString()}`,
                    change: `${s.revenue_change || 0}%`,
                    trend: (s.revenue_change || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Active Properties",
                    value: String(s.active_properties || 0),
                    change: `${s.properties_change || 0}%`,
                    trend: (s.properties_change || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Total Bookings",
                    value: String(s.total_bookings || 0),
                    change: `${s.bookings_change || 0}%`,
                    trend: (s.bookings_change || 0) >= 0 ? "up" : "down",
                },
                {
                    title: "Page Views",
                    value: String(s.page_views || 0),
                    change: `${s.views_change || 0}%`,
                    trend: (s.views_change || 0) >= 0 ? "up" : "down",
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
