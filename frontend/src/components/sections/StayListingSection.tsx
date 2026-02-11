"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import StayGrid from "../stays/StayGrid";
import FilterBar from "../stays/FilterBar";
import { SortOption } from "../stays/SortBar";
import { StayIntent, StayCategory } from "../../types/stay";
import { useStays } from "../../hooks/useStays";
import { useSearchParams } from "next/navigation";

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
    onCategoryChange,
}: StayListingSectionProps) {

    const searchParams = useSearchParams();

    const [sort, setSort] = useState<SortOption>("recommended");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [intentFilter, setIntentFilter] = useState<StayIntent | "all">("all");
    const [internalLocation, setInternalLocation] = useState(searchParams.get("location") || "all");

    // Update internal state if URL params change
    useEffect(() => {
        const query = searchParams.get("query");
        const loc = searchParams.get("location");
        if (query !== null) setSearchQuery(query);
        if (loc !== null) setInternalLocation(loc);
    }, [searchParams]);

    const locationFilter = externalLocation !== undefined ? externalLocation : internalLocation;
    const setLocationFilter = onExternalLocationChange || setInternalLocation;

    // Derived Filters for Hook
    const filters = useMemo(() => {
        return {
            location: locationFilter !== 'all' ? locationFilter : undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            // query: searchQuery, // If backend supports generic query
            // guests: ... (need to lift state or read from params)
        };
    }, [locationFilter, selectedCategory, searchQuery]);

    // Pass filters to hook
    const { stays, loading, error } = useStays(filters);

    // Derive locations from live data (or static list if needed)
    // Note: if filtered, locations list might shrink. Better to have static or separate query.
    // For now, deriving from current stays is okay but might be weird UX.
    const locations = useMemo(() => {
        const locs = new Set(stays.map((s) => s.location));
        return Array.from(locs).sort();
    }, [stays]);


    const handleSortChange = useCallback((value: SortOption) => {
        setSort(value);
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-14 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-64 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                    Unable to load stays
                </p>
                <p className="text-sm text-muted">
                    Please check your connection and try again.
                </p>
            </div>
        );
    }

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
                stays={stays}
            />
        </section>
    );
}
