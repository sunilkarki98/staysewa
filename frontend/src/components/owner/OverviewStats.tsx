"use client";

import { TrendUp, Users, HouseLine, CurrencyDollar, Bed } from "@phosphor-icons/react";

const STATS = [
    {
        title: "Total Revenue",
        value: "NPR 1,25,000",
        change: "+12.5%",
        icon: CurrencyDollar,
        trend: "up",
    },
    {
        title: "Active Stays",
        value: "24",
        change: "+2",
        icon: HouseLine,
        trend: "up",
    },
    {
        title: "Pending Bookings",
        value: "8",
        change: "-1",
        icon: Bed,
        trend: "down",
    },
    {
        title: "Profile Views",
        value: "1,432",
        change: "+5.3%",
        icon: Users,
        trend: "up",
    },
];

export default function OverviewStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS.map((stat, index) => {
                const Icon = stat.icon;
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
