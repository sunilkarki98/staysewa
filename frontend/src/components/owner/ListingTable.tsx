"use client";

import { EyeIcon, PencilSimpleIcon, TrashIcon, StarIcon, MapPinIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Stay } from "@/types/stay";
import EditListingDrawer from "./EditListingDrawer";
import { useStays } from "@/hooks/useStays";

export default function ListingTable() {
    const { stays, loading, deleteStay } = useStays();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filter stays based on search
    const filteredStays = stays.filter(stay =>
        stay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            await deleteStay(id);
        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsEditDrawerOpen(true);
    };

    const handleSave = (updatedListing: Stay) => {
        console.log("Saving listing:", updatedListing);
        // Here you would typically call an update method from the hook
        // await updateStay(updatedListing);
        setIsEditDrawerOpen(false);
        setEditingId(null);
    };

    if (loading) {
        return <div className="p-8 text-center text-stone-500">Loading listings...</div>;
    }

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    Your Listings
                </h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-medium">Property</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Location</th>
                            <th className="p-4 font-medium">Price</th>
                            <th className="p-4 font-medium">Rating</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {filteredStays.length > 0 ? (
                            filteredStays.map((stay) => (
                                <tr key={stay.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-16 relative rounded-md overflow-hidden bg-stone-200">
                                                <Image
                                                    src={stay.images[0]}
                                                    alt={stay.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-stone-900 dark:text-white truncate max-w-[150px]">
                                                {stay.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-stone-600 dark:text-stone-300 capitalize text-sm">
                                        {stay.type}
                                    </td>
                                    <td className="p-4 text-stone-500 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <MapPinIcon size={14} />
                                            {stay.location}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-stone-900 dark:text-white text-sm">
                                        NPR {stay.price} <span className="text-stone-400 font-normal text-xs">/night</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                                            <StarIcon weight="fill" size={14} />
                                            {stay.rating}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/owner/listings/${stay.id}`}
                                                className="p-2 text-stone-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <EyeIcon size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(stay.id)}
                                                className="p-2 text-stone-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <PencilSimpleIcon size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(stay.id, stay.name)}
                                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <TrashIcon size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-stone-500">
                                    No listings found matching &quot;{searchTerm}&quot;
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-sm text-stone-500">
                <span>Showing {filteredStays.length} listings</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>

            <EditListingDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                listing={stays.find(s => s.id === editingId) || null}
                onSave={handleSave}
            />
        </div >
    );
}
