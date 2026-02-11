"use client";
import {
    TagIcon,
    MapPinIcon,
    ShieldCheckIcon,
    StarIcon,
} from "@phosphor-icons/react";

const features = [
    {
        title: "Best Prices Guaranteed",
        description: "Transparent pricing with no hidden fees.",
        Icon: TagIcon,
        gradient: "from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40",
        iconBg: "bg-orange-100 dark:bg-orange-800",
        iconColor: "text-red-600 dark:text-red-300",
        hoverBorder: "hover:border-orange-500",
    },
    {
        title: "Prime Locations",
        description: "Hostels near top attractions and travel hubs.",
        Icon: MapPinIcon,
        gradient: "from-stone-100 to-orange-100 dark:from-stone-900/40 dark:to-orange-900/40",
        iconBg: "bg-orange-100 dark:bg-orange-800",
        iconColor: "text-stone-700 dark:text-stone-300",
        hoverBorder: "hover:border-stone-500",
    },
    {
        title: "Verified Hostels",
        description: "Checked for safety, cleanliness, and comfort.",
        Icon: ShieldCheckIcon,
        gradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40",
        iconBg: "bg-orange-100 dark:bg-orange-800",
        iconColor: "text-emerald-700 dark:text-emerald-300",
        hoverBorder: "hover:border-emerald-500",
    },
    {
        title: "Real Guest Reviews",
        description: "Honest ratings from real travelers.",
        Icon: StarIcon,
        gradient: "from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
        iconBg: "bg-orange-100 dark:bg-orange-800",
        iconColor: "text-amber-700 dark:text-amber-300",
        hoverBorder: "hover:border-amber-500",
    },
];

import { useLocation } from "@/context/LocationContext";

export default function WhyChooseUs() {
    const { city } = useLocation();
    return (
        <section className="bg-neutral dark:bg-stone-950 py-8">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-text via-orange-800 to-red-800 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent">
                        Why Travelers Choose StaySewa
                    </h2>
                    <p className="mt-4 text-lg text-muted dark:text-stone-400">
                        Everything you need for a smooth stay in {city}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(({ title, description, Icon, gradient, iconBg, iconColor, hoverBorder }, index) => (
                        <div
                            key={index}
                            className={`group flex items-start gap-4 rounded-xl border border-border dark:border-stone-700/50 bg-gradient-to-br ${gradient} px-5 py-5 shadow-lg shadow-stone-200/50 dark:shadow-none transition-all duration-300 ${hoverBorder} hover:shadow-xl hover:shadow-orange-100 dark:hover:shadow-stone-900 hover:-translate-y-1`}>
                            {/* Icon */}
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-all duration-300 group-hover:scale-110`}>
                                <Icon size={24} weight="bold" />
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-base font-semibold text-text dark:text-white leading-tight">
                                    {title}
                                </h3>
                                <p className="mt-1.5 text-sm text-muted dark:text-gray-400 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
