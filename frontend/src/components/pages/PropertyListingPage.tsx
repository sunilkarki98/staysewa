"use client";

import PropertyTabs from "../properties/PropertyTabs";
import StayListingSection from "../sections/StayListingSection";
import { usePropertyType } from "../../hooks/usePropertyType";
import { useLocation } from "@/context/LocationContext";
import { Suspense } from "react";
import type { PropertyType } from "../../hooks/usePropertyType";

export default function PropertyListingPage() {
    const propertyType = usePropertyType();
    const { city } = useLocation();

    const getTitle = (category: PropertyType["category"]) => {
        const labels: Record<string, string> = {
            hostel: "Hostels",
            apartment: "Apartments",
            homestay: "Homestays",
            hotel: "Hotels",
            resort: "Resorts",
            room: "Rooms",
        };
        return `${labels[category] || "Properties"} in ${city}`;
    };

    return (
        <main className="min-h-screen bg-bg">
            {/* Header */}
            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-2xl font-semibold text-text">
                        {getTitle(propertyType.category)}
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Browse verified properties with transparent pricing
                    </p>

                    <div className="mt-4">
                        <PropertyTabs />
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
