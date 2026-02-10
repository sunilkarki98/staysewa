"use client";

import ListingTable from "@/components/owner/ListingTable";
import { PlusIcon, FunnelIcon, SortAscendingIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function MyListingsPage() {
    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        My Listings
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Manage your property listings and availability.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                        <FunnelIcon size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                        <SortAscendingIcon size={16} />
                        Sort
                    </button>
                    <Link
                        href="/owner/listings/new"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                    >
                        <PlusIcon size={16} weight="bold" />
                        Add New
                    </Link>
                </div>
            </div>

            {/* Content */}
            <ListingTable />
        </div>
    );
}
