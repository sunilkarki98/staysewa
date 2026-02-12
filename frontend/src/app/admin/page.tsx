"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import {
    Users,
    CalendarCheck,
    CurrencyDollar,
    Buildings,
    TrendUp,
} from "@phosphor-icons/react";

interface Stats {
    users: number;
    bookings: number;
    properties: number;
    revenue: number;
}

interface Activity {
    id: string;
    guest_name: string;
    status: string;
    amount: number;
    created_at: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                apiClient.get<{ status: string; data: { stats: Stats } }>(API_CONFIG.ENDPOINTS.ADMIN.STATS),
                apiClient.get<{ status: string; data: { activity: Activity[] } }>(API_CONFIG.ENDPOINTS.ADMIN.ACTIVITY),
            ]);
            setStats(statsRes.data.stats);
            setActivity(activityRes.data.activity);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Revenue", value: `Rs ${(stats?.revenue || 0).toLocaleString()}`, icon: CurrencyDollar, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
        { label: "Total Users", value: String(stats?.users || 0), icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
        { label: "Total Bookings", value: String(stats?.bookings || 0), icon: CalendarCheck, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
        { label: "Active Properties", value: String(stats?.properties || 0), icon: Buildings, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
    ];

    const statusColor: Record<string, string> = {
        confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        reserved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System overview and recent activity</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {card.label}
                            </span>
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <card.icon size={18} weight="bold" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                            <TrendUp size={14} weight="bold" />
                            <span>All time</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Guest</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activity.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.guest_name || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[item.status] || "bg-gray-100 text-gray-700"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Rs {Number(item.amount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </td>
                                </tr>
                            ))}
                            {activity.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No recent activity</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
