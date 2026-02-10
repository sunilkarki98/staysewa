"use client";

import { useState, useCallback, useMemo } from "react";
import StayGrid from "../stays/StayGrid";
import FilterBar from "../stays/FilterBar";
import { SortOption } from "../stays/SortBar";
import { StayIntent, StayCategory } from "../../types/stay-types";
import { MOCK_STAYS } from "../../data/stays";

type StayListingSectionProps = {
    isCustomerView?: boolean;
    selectedCategory?: StayCategory | "all";
    externalLocation?: string;
    onExternalLocationChange?: (location: string) => void;
    onCategoryChange?: (category: StayCategory | "all") => void;
};

export default function StayListingSection({
    isCustomerView = false,
    selectedCategory,
    externalLocation,
    onExternalLocationChange,
    onCategoryChange
}: StayListingSectionProps) {
    const [sort, setSort] = useState<SortOption>("recommended");
    const [searchQuery, setSearchQuery] = useState("");
    const [intentFilter, setIntentFilter] = useState<StayIntent | "all">("all");
    const [internalLocation, setInternalLocation] = useState("all");

    // Use external control if provided, otherwise internal
    const locationFilter = externalLocation !== undefined ? externalLocation : internalLocation;
    const setLocationFilter = onExternalLocationChange || setInternalLocation;

    // Extract unique locations from data for the filter
    const locations = useMemo(() => {
        // Simple extraction - in real app this might come from API or refined list
        const locs = new Set(MOCK_STAYS.map(s => s.location));
        return Array.from(locs).sort();
    }, []);

    const handleSortChange = useCallback((value: SortOption) => {
        setSort(value);
    }, []);

    return (
        <section className="space-y-6">
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                locationFilter={locationFilter}
                onLocationChange={setLocationFilter}
                sort={sort}
                onSortChange={handleSortChange}
                intentFilter={intentFilter}
                onIntentChange={setIntentFilter}
                locations={locations}
                hideLocation={externalLocation !== undefined}
                activeCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
            />

            <StayGrid
                sort={sort}
                searchQuery={searchQuery}
                intentFilter={intentFilter}
                locationFilter={locationFilter}
                isCustomerView={isCustomerView}
                explicitCategory={selectedCategory}
            />
        </section>
    );
}
