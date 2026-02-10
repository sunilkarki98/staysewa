"use client";

import { useUserIntent } from "../../context/UserIntentContext";
import { MOCK_STAYS } from "../../data/stays";
import StayCard from "./StayCard";
import type { SortOption } from "./SortBar";
import type { StayIntent, StayCategory } from "../../types/stay-types";
import CustomerStayCard from "./CustomerStayCard";

type StayGridProps = {
    sort: SortOption;
    searchQuery?: string;
    intentFilter?: StayIntent | "all";
    locationFilter?: string;
    isCustomerView?: boolean;
    explicitCategory?: StayCategory | "all";
};

export default function StayGrid({
    sort,
    searchQuery = "",
    intentFilter = "all",
    locationFilter = "all",
    isCustomerView = false,
    explicitCategory
}: StayGridProps) {
    const { category: contextCategory } = useUserIntent();
    // Use explicit category if provided (for dashboard), otherwise fallback to context (for explore/listing pages)
    const category = explicitCategory || contextCategory;

    let stays = category === "all"
        ? MOCK_STAYS
        : MOCK_STAYS.filter((stay) => stay.type === category);

    // Intent filtering
    if (intentFilter !== "all") {
        stays = stays.filter((stay) => stay.intent === intentFilter);
    }

    // Location filtering
    if (locationFilter && locationFilter !== "all") {
        stays = stays.filter((stay) => stay.location.includes(locationFilter));
    }

    // Simple search filtering
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        stays = stays.filter(s => s.location.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    // 🔽 Sorting logic
    if (sort === "price_low") {
        stays = [...stays].sort((a, b) => a.price - b.price);
    }

    if (sort === "price_high") {
        stays = [...stays].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        stays = [...stays].sort((a, b) => b.rating - a.rating);
    }

    // Dynamic Header Logic
    const getHeaderText = () => {
        const catText = category === "all" ? "Stays" : category;
        const locationText = searchQuery.trim() ? `in "${searchQuery}"` : "in Kathmandu"; // Default location
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
                    {stays.map((stay) => (
                        isCustomerView ? (
                            <CustomerStayCard
                                key={stay.id}
                                {...stay}
                                showBadges={intentFilter === "all"}
                            />
                        ) : (
                            <StayCard key={stay.id} {...stay} />
                        )
                    ))}
                </div>
            )}
        </section>
    );
}
