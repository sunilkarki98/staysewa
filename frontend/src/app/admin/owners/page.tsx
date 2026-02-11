"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import {
    MagnifyingGlass,
    ShieldCheck,
    Prohibit,
    CheckCircle,
    Clock,
    WarningCircle,
} from "@phosphor-icons/react";

interface Owner {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
    createdAt: string;
    businessName: string | null;
    verificationStatus: string | null;
    totalEarnings: number | null;
}

interface OwnersResponse {
    owners: Owner[];
    total: number;
    page: number;
    totalPages: number;
}

export default function AdminOwnersPage() {
    const [data, setData] = useState<OwnersResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchOwners = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get<{ status: string; data: OwnersResponse }>(
                `${API_CONFIG.ENDPOINTS.ADMIN.OWNERS}?page=${page}&limit=10&search=${search}`
            );
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch owners", error);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchOwners();
    }, [fetchOwners]);

    const handleVerify = async (id: string) => {
        setActionLoading(id);
        try {
            await apiClient.patch(API_CONFIG.ENDPOINTS.ADMIN.VERIFY_OWNER(id), {});
            fetchOwners();
        } catch (error) {
            console.error("Failed to verify owner", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleBan = async (id: string, ban: boolean) => {
        setActionLoading(id);
        try {
            await apiClient.patch(API_CONFIG.ENDPOINTS.ADMIN.BAN_OWNER(id), { ban });
            fetchOwners();
        } catch (error) {
            console.error("Failed to ban/unban owner", error);
        } finally {
            setActionLoading(null);
        }
    };

    const verificationBadge = (status: string | null) => {
        const map: Record<string, { label: string; icon: React.ElementType; className: string }> = {
            verified: { label: "Verified", icon: CheckCircle, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
            pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
            rejected: { label: "Rejected", icon: WarningCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
        };
        const badge = map[status || "pending"] || map.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                <badge.icon size={14} weight="bold" />
                {badge.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Owner Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {data?.total || 0} registered owners
                    </p>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg w-full sm:w-72">
                    <MagnifyingGlass size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Business</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Verification</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Earnings</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                            ) : data?.owners.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No owners found</td></tr>
                            ) : (
                                data?.owners.map((owner) => (
                                    <tr key={owner.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {owner.name?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{owner.name}</p>
                                                    <p className="text-xs text-gray-500">{owner.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{owner.businessName || "—"}</td>
                                        <td className="px-6 py-4">{verificationBadge(owner.verificationStatus)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${owner.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                                                {owner.isActive ? "Active" : "Banned"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            Rs {((owner.totalEarnings || 0) / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {owner.verificationStatus !== "verified" && (
                                                    <button
                                                        onClick={() => handleVerify(owner.id)}
                                                        disabled={actionLoading === owner.id}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-50"
                                                    >
                                                        <ShieldCheck size={14} />
                                                        Verify
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleBan(owner.id, owner.isActive)}
                                                    disabled={actionLoading === owner.id}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${owner.isActive
                                                            ? "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                                                            : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                                                        }`}
                                                >
                                                    <Prohibit size={14} />
                                                    {owner.isActive ? "Ban" : "Unban"}
                                                </button>
                                            </div>
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
