"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import { Property, PROPERTY_TYPE_LABELS } from "@/types/property";
import { CheckCircle, XCircle, MapPin, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await apiClient.get<{ status: string; data: { properties: Property[] } }>(API_CONFIG.ENDPOINTS.ADMIN.PROPERTIES);
            setProperties(response.data.properties);
        } catch (error) {
            console.error("Failed to fetch properties", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, verify: boolean) => {
        try {
            // Placeholder for verification logic
            // await apiClient.patch(API_CONFIG.ENDPOINTS.ADMIN.VERIFY_PROPERTY(id), { verified: verify });
            fetchProperties();
        } catch (error) {
            console.error("Failed to verify property", error);
        }
    };

    const filteredProperties = properties.filter(p => {
        if (filter === "all") return true;
        if (filter === "verified") return p.status === "active";
        if (filter === "pending") return p.status === "pending";
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verify and manage all property listings</p>
                </div>

                <div className="flex gap-2">
                    {["all", "pending", "verified"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${filter === f
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Property</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Owner</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Category</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                <th className="text-right px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredProperties.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-14 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={p.media?.[0]?.url || "/placeholder-property.jpg"}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white capitalize">{p.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin size={12} />
                                                    {p.city}, {p.district}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                        {p.owner_id ? "View Owner" : "System"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                            {PROPERTY_TYPE_LABELS[p.type] || p.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "active"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : p.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <Link href={`/properties/${p.id}`} target="_blank" className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors">
                                                <Eye size={18} />
                                            </Link>
                                            {p.status === "pending" ? (
                                                <button onClick={() => handleVerify(p.id, true)} className="p-1.5 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors">
                                                    <CheckCircle size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleVerify(p.id, false)} className="p-1.5 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors">
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            <button className="p-1.5 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
