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
        gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
        iconBg: "bg-blue-100 dark:bg-blue-900/40",
        iconColor: "text-blue-600 dark:text-blue-400",
        hoverBorder: "hover:border-blue-400",
    },
    {
        title: "Prime Locations",
        description: "Hostels near top attractions and travel hubs.",
        Icon: MapPinIcon,
        gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
        iconBg: "bg-purple-100 dark:bg-purple-900/40",
        iconColor: "text-purple-600 dark:text-purple-400",
        hoverBorder: "hover:border-purple-400",
    },
    {
        title: "Verified Hostels",
        description: "Checked for safety, cleanliness, and comfort.",
        Icon: ShieldCheckIcon,
        gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        hoverBorder: "hover:border-emerald-400",
    },
    {
        title: "Real Guest Reviews",
        description: "Honest ratings from real travelers.",
        Icon: StarIcon,
        gradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
        iconBg: "bg-amber-100 dark:bg-amber-900/40",
        iconColor: "text-amber-600 dark:text-amber-400",
        hoverBorder: "hover:border-amber-400",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-14">
            <div className="mx-auto max-w-[1400px] px-3">
                {/* Section Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Why Travelers Choose StaySewa
                    </h2>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                        Everything you need for a smooth stay in Kathmandu
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(({ title, description, Icon, gradient, iconBg, iconColor, hoverBorder }, index) => (
                        <div
                            key={index}
                            className={`group flex items-start gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br ${gradient} px-5 py-5 shadow-sm transition-all duration-300 ${hoverBorder} hover:shadow-lg hover:-translate-y-1`}>
                            {/* Icon */}
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-all duration-300 group-hover:scale-110`}>
                                <Icon size={24} weight="bold" />
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-white leading-tight">
                                    {title}
                                </h3>
                                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
