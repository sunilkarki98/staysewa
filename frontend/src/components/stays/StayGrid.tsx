"use client";

import { useMemo } from "react";
import { useUserIntent } from "../../context/UserIntentContext";
import { useLocation } from "@/context/LocationContext";
import StayCard from "./StayCard";
import type { SortOption } from "./SortBar";
import type { StayIntent, StayCategory } from "../../types/stay";
import type { Stay } from "../../types/stay";
import CustomerStayCard from "./CustomerStayCard";

type StayGridProps = {
    sort: SortOption;
    searchQuery?: string;
    intentFilter?: StayIntent | "all";
    locationFilter?: string;
    isCustomerView?: boolean;
    explicitCategory?: StayCategory | "all";
    stays: Stay[];
};

export default function StayGrid({
    sort,
    searchQuery = "",
    intentFilter = "all",
    locationFilter = "all",
    isCustomerView = false,
    explicitCategory,
    stays: rawStays,
}: StayGridProps) {
    const { category: contextCategory } = useUserIntent();
    const { city } = useLocation();
    const category = explicitCategory || contextCategory;

    const stays = useMemo(() => {
        let filtered = category === "all"
            ? rawStays
            : rawStays.filter((stay) => stay.type === category);

        // Intent filtering
        if (intentFilter !== "all") {
            filtered = filtered.filter((stay) => stay.intent === intentFilter);
        }

        // Location filtering
        if (locationFilter && locationFilter !== "all") {
            filtered = filtered.filter((stay) => stay.location.includes(locationFilter));
        }

        // Search filtering
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) => s.location.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
            );
        }

        // Sorting
        const sorted = [...filtered];
        if (sort === "price_low") sorted.sort((a, b) => a.price - b.price);
        if (sort === "price_high") sorted.sort((a, b) => b.price - a.price);
        if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);

        return sorted;
    }, [rawStays, category, intentFilter, locationFilter, searchQuery, sort]);

    const getHeaderText = () => {
        const catText = category === "all" ? "Stays" : category;
        const currentLoc = (locationFilter && locationFilter !== "all") ? locationFilter : city;
        const locationText = searchQuery.trim() ? `in "${searchQuery}"` : `in ${currentLoc}`;
        return `${catText} ${locationText}`;
    };

    return (
        <section className="mt-8">
            <h2 className="mb-6 text-xl font-semibold capitalize text-text dark:text-white">
                {getHeaderText()}
            </h2>

            {stays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                        No stays found
                    </p>
                    <p className="text-sm text-muted">
                        Try adjusting your filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {stays.map((stay) =>
                        isCustomerView ? (
                            <CustomerStayCard
                                key={stay.id}
                                {...stay}
                                showBadges={intentFilter === "all"}
                            />
                        ) : (
                            <StayCard key={stay.id} {...stay} />
                        )
                    )}
                </div>
            )}
        </section>
    );
}
