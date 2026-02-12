"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import PropertyGrid from "../properties/PropertyGrid";
import FilterBar from "../properties/FilterBar";
import { SortOption } from "../properties/SortBar";
import { PropertyCategory, Property } from "../../types/property";
import { useProperties } from "../../hooks/useProperties";
import { useSearchParams } from "next/navigation";

type PropertyListingSectionProps = {
    isCustomerView?: boolean;
    selectedCategory?: PropertyCategory | "all";
    externalLocation?: string;
    onExternalLocationChange?: (location: string) => void;
    onCategoryChange?: (category: PropertyCategory | "all") => void;
};

export default function PropertyListingSection({
    isCustomerView = false,
    selectedCategory,
    externalLocation,
    onExternalLocationChange,
    onCategoryChange,
}: PropertyListingSectionProps) {

    const searchParams = useSearchParams();

    const [sort, setSort] = useState<SortOption>("recommended");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
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
            type: selectedCategory !== 'all' ? selectedCategory : undefined,
        };
    }, [locationFilter, selectedCategory]);

    // Pass filters to hook
    const { properties, loading, error } = useProperties(filters as any);

    // Derive locations from live data
    const locations = useMemo(() => {
        const locs = new Set(properties.map((p) => p.city));
        return Array.from(locs).sort();
    }, [properties]);


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
                    Unable to load properties
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
                locations={locations}
                hideLocation={externalLocation !== undefined}
                activeCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
            />

            <PropertyGrid
                sort={sort}
                searchQuery={searchQuery}
                locationFilter={locationFilter}
                isCustomerView={isCustomerView}
                explicitCategory={selectedCategory}
                properties={properties}
            />
        </section>
    );
}
