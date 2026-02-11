"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";

interface Booking {
    id: string;
    bookingNumber: string | null;
    guestName: string;
    amount: number;
    status: string;
    checkIn: string;
    checkOut: string;
    createdAt: string;
    stayName: string | null;
}

interface BookingsResponse {
    bookings: Booking[];
    total: number;
    page: number;
    totalPages: number;
}

export default function AdminBookingsPage() {
    const [data, setData] = useState<BookingsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get<{ status: string; data: BookingsResponse }>(
                `${API_CONFIG.ENDPOINTS.ADMIN.BOOKINGS}?page=${page}&limit=15`
            );
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const statusColor: Record<string, string> = {
        confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        reserved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Audit</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {data?.total || 0} total bookings across the platform
                </p>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Booking #</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Guest</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Property</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Check-in</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Check-out</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                            ) : data?.bookings.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No bookings found</td></tr>
                            ) : (
                                data?.bookings.map((b) => (
                                    <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                            {b.bookingNumber || b.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{b.guestName || "N/A"}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{b.stayName || "—"}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(b.checkIn)}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(b.checkOut)}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Rs {Number(b.amount || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[b.status] || "bg-gray-100 text-gray-700"}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-500">
                            Page {data.page} of {data.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-700 dark:text-gray-300"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page >= data.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-700 dark:text-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
