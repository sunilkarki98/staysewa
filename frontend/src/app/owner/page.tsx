"use client";

import OverviewStats from "@/components/owner/OverviewStats";
import RecentActivity from "@/components/owner/RecentActivity";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function OwnerDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Dashboard Overview
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Here's what's happening with your properties today.
                    </p>
                </div>

                <Link
                    href="/owner/listings"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-primary/90 transition shadow-sm active:scale-95"
                >
                    <PlusIcon size={18} weight="bold" />
                    <span>Add New Listing</span>
                </Link>
            </div>

            <OverviewStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-orange-50/50 dark:from-primary/10 dark:to-stone-900 rounded-2xl border border-primary/10 p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                        <p className="text-stone-400 font-medium mb-2">Revenue Chart Placeholder</p>
                        <p className="text-xs text-stone-300">Using mock data for prototype</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
