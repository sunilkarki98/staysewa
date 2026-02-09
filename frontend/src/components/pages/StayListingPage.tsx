"use client";

import StayTabs from "../stays/StayTabs";
import StayListingSection from "../sections/StayListingSection";
import { useStayType } from "../../hooks/useStayType";
import type { StayType as StayTypeObject } from "../../types/stay-types";

const TITLE_MAP: Record<StayTypeObject["category"], string> = {
    hostels: "Hostels in Kathmandu",
    flats: "Flats in Kathmandu",
    homestays: "Homestays in Kathmandu",
};

export default function StayListingPage() {
    const stayType = useStayType();

    return (
        <main className="min-h-screen bg-bg">
            {/* Header */}
            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-2xl font-semibold text-text">
                        {TITLE_MAP[stayType.category]} {/* ✅ access category */}
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
            <StayListingSection />
        </main>
    );
}
