"use client";

import {
    MagnifyingGlassIcon,
    CalendarCheckIcon,
    BackpackIcon,
    HouseIcon,
} from "@phosphor-icons/react";
import StepCard from "../ui/StepCard";

export default function HowItWorks() {
    return (
        <section className="relative bg-gradient-to-b from-white via-violet-50/30 to-white dark:from-gray-900 dark:via-violet-950/20 dark:to-gray-900 py-28 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 dark:bg-violet-800/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-800/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-3">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Book hostels or short-term flats in just a few simple steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid gap-8 md:gap-6 md:grid-cols-3 relative z-10">
                    <StepCard
                        step={1}
                        title="Search & Compare"
                        description="Explore verified hostels and short-term flats with transparent pricing."
                        icon={<MagnifyingGlassIcon size={24} weight="duotone" />}
                        gradient="from-blue-500 to-indigo-600"
                        cardBg="from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20"
                        iconBg="from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                    />

                    <StepCard
                        step={2}
                        title="Book Instantly"
                        description="Choose your dates, confirm availability, and book securely."
                        icon={<CalendarCheckIcon size={24} weight="duotone" />}
                        gradient="from-purple-500 to-pink-600"
                        cardBg="from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20"
                        iconBg="from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40"
                    />

                    <StepCard
                        step={3}
                        title="Check-in & Stay"
                        description="Arrive, check in, and enjoy your stay — hostel or entire flat."
                        icon={
                            <div className="flex gap-3 items-center justify-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                                    <BackpackIcon size={20} weight="duotone" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                                    <HouseIcon size={20} weight="duotone" />
                                </div>
                            </div>
                        }
                        gradient="from-emerald-500 to-teal-600"
                        cardBg="from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20"
                        iconBg="from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40"
                        iconContainerClass="w-auto px-0"
                        customIcon={true}
                        isLast
                    />
                </div>
            </div>
        </section>
    );
}
