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
        <section className="relative bg-gradient-to-b from-bg via-orange-50/30 to-bg dark:from-gray-900 dark:via-stone-900/20 dark:to-gray-900 py-8 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-100/10 dark:bg-red-900/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-text via-orange-800 to-red-800 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-muted dark:text-stone-400">
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
                        gradient="from-orange-500 to-red-600"
                        cardBg="from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20"
                        iconBg="from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40"
                    />

                    <StepCard
                        step={2}
                        title="Book Instantly"
                        description="Choose your dates, confirm availability, and book securely."
                        icon={<CalendarCheckIcon size={24} weight="duotone" />}
                        gradient="from-amber-500 to-orange-600"
                        cardBg="from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20"
                        iconBg="from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40"
                    />

                    <StepCard
                        step={3}
                        title="Check-in & Stay"
                        description="Arrive, check in, and enjoy your stay — hostel or entire flat."
                        icon={
                            <div className="flex gap-3 items-center justify-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stone-600 to-stone-800 text-white shadow-md shadow-stone-500/20">
                                    <BackpackIcon size={20} weight="duotone" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20">
                                    <HouseIcon size={20} weight="duotone" />
                                </div>
                            </div>
                        }
                        gradient="from-stone-600 to-stone-800"
                        cardBg="from-stone-50/80 to-stone-100/80 dark:from-stone-900/20 dark:to-stone-800/20"
                        iconBg="from-stone-100 to-stone-200 dark:from-stone-900/40 dark:to-stone-800/40"
                        iconContainerClass="w-auto px-0"
                        customIcon={true}
                        isLast
                    />
                </div>
            </div>
        </section>
    );
}
