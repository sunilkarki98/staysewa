"use client";

import { EyeIcon, PencilSimpleIcon, TrashIcon, StarIcon, MapPinIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_STAYS, Stay } from "../../data/stays";
import EditListingDrawer from "./EditListingDrawer";

export default function ListingTable() {
    const [listings, setListings] = useState(MOCK_STAYS);
    const [editingListing, setEditingListing] = useState<Stay | null>(null);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const router = useRouter();

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            setListings((prev) => prev.filter((stay) => stay.id !== id));
        }
    };

    const handleEdit = (id: string) => {
        const listingToEdit = listings.find((stay) => stay.id === id);
        if (listingToEdit) {
            setEditingListing(listingToEdit);
            setIsEditDrawerOpen(true);
        }
    };

    const handleSave = (updatedListing: Stay) => {
        setListings((prev) =>
            prev.map((stay) => (stay.id === updatedListing.id ? updatedListing : stay))
        );
        setIsEditDrawerOpen(false);
    };

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 text-xs uppercase tracking-wider text-stone-500 font-semibold">
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {listings.map((stay) => (
                            <tr key={stay.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                            <Image
                                                src={stay.images[0]}
                                                alt={stay.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-stone-900 dark:text-white text-base line-clamp-1">
                                                {stay.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-sm text-stone-500 mt-0.5">
                                                <StarIcon weight="fill" className="text-yellow-400" size={14} />
                                                <span>{stay.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="capitalize text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stay.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
                                        <MapPinIcon size={16} />
                                        <span>{stay.location}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-base font-semibold text-stone-900 dark:text-white">
                                        NPR {stay.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-stone-400 ml-1">/night</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={`/stays/${stay.id}`}
                                            className="p-2 text-stone-500 dark:text-stone-400 hover:text-primary hover:bg-orange-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
                                            title="View property"
                                        >
                                            <EyeIcon size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(stay.id)}
                                            className="p-2 text-stone-500 dark:text-stone-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit listing"
                                        >
                                            <PencilSimpleIcon size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stay.id, stay.name)}
                                            className="p-2 text-stone-500 dark:text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete listing"
                                        >
                                            <TrashIcon size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-sm text-stone-500">
                <span>Showing {listings.length} listings</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>

            <EditListingDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                listing={editingListing}
                onSave={handleSave}
            />
        </div >
    );
}
