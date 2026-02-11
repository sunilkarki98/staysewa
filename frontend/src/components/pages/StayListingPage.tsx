"use client";

import StayTabs from "../stays/StayTabs";
import StayListingSection from "../sections/StayListingSection";
import { useStayType } from "../../hooks/useStayType";
import { useLocation } from "@/context/LocationContext";
import { Suspense } from "react";
import type { StayType } from "../../hooks/useStayType";

export default function StayListingPage() {
    const stayType = useStayType();
    const { city } = useLocation();

    const getTitle = (category: StayType["category"]) => {
        const labels: Record<string, string> = {
            hostel: "Hostels",
            apartment: "Apartments",
            homestay: "Homestays",
            hotel: "Hotels",
            room: "Rooms",
        };
        return `${labels[category] || "Stays"} in ${city}`;
    };

    return (
        <main className="min-h-screen bg-bg">
            {/* Header */}
            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-2xl font-semibold text-text">
                        {getTitle(stayType.category)}
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Browse verified stays with transparent pricing
                    </p>

                    <div className="mt-4">
                        <StayTabs />
                    </div>
                </div>
            </section>

            {/* Listings */}
            <Suspense fallback={<div className="h-96 animate-pulse bg-stone-100 dark:bg-stone-900 rounded-xl" />}>
                <StayListingSection />
            </Suspense>
        </main>
    );
}
