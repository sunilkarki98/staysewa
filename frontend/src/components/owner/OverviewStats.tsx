"use client";

import { TrendUp, Users, HouseLine, CurrencyDollar, Bed } from "@phosphor-icons/react";
import { useStats } from "@/hooks/useStats";

export default function OverviewStats() {
    const { stats, loading, error } = useStats();

    if (loading) {
        return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-stone-100 dark:bg-stone-800 rounded-2xl"></div>
            ))}
        </div>;
    }

    if (error || !stats) {
        return <div className="text-red-500 mb-8">Failed to load statistics.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
                // Map string icon names to components if needed, or pass component directly from mock
                // For now, let's assume the mock returns the same structure but without the icon component itself
                // We need to map it back or adjust the mock to avoid serializing functions

                // MOCK ADAPTER FIX: The mock returns objects, we need to map icons here based on title or trend
                let Icon = CurrencyDollar;
                if (stat.title.includes("Active")) Icon = HouseLine;
                if (stat.title.includes("Bookings")) Icon = Bed;
                if (stat.title.includes("Views")) Icon = Users;

                const isPositive = stat.trend === "up";

                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-1">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                <Icon size={24} weight="duotone" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className={`flex items-center gap-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {isPositive && <TrendUp size={14} weight="bold" />}
                                {stat.change}
                            </span>
                            <span className="text-stone-400">vs last month</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
