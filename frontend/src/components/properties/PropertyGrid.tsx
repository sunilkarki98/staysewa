"use client";

import { useMemo } from "react";
import { useUserIntent } from "../../context/UserIntentContext";
import { useLocation } from "@/context/LocationContext";
import PropertyCard from "./PropertyCard";
import type { SortOption } from "./SortBar";
import type { PropertyCategory, Property } from "../../types/property";
import CustomerPropertyCard from "./CustomerPropertyCard";

type PropertyGridProps = {
    sort: SortOption;
    searchQuery?: string;
    locationFilter?: string;
    isCustomerView?: boolean;
    explicitCategory?: PropertyCategory | "all";
    properties: Property[];
};

export default function PropertyGrid({
    sort,
    searchQuery = "",
    locationFilter = "all",
    isCustomerView = false,
    explicitCategory,
    properties: rawProperties,
}: PropertyGridProps) {
    const { category: contextCategory } = useUserIntent();
    const { city } = useLocation();
    const category = explicitCategory || contextCategory;

    const properties = useMemo(() => {
        let filtered = category === "all"
            ? rawProperties
            : rawProperties.filter((p) => p.type === category);

        // Location filtering
        if (locationFilter && locationFilter !== "all") {
            filtered = filtered.filter((p) => p.address_line.includes(locationFilter) || p.city.includes(locationFilter));
        }

        // Search filtering
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) => p.city.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.address_line.toLowerCase().includes(q)
            );
        }

        // Sorting
        const sorted = [...filtered];
        if (sort === "price_low") sorted.sort((a, b) => a.base_price - b.base_price);
        if (sort === "price_high") sorted.sort((a, b) => b.base_price - a.base_price);
        if (sort === "rating") sorted.sort((a, b) => b.avg_rating - a.avg_rating);

        return sorted;
    }, [rawProperties, category, locationFilter, searchQuery, sort]);

    const getHeaderText = () => {
        const catText = category === "all" ? "Properties" : category;
        const currentLoc = (locationFilter && locationFilter !== "all") ? locationFilter : city;
        const locationText = searchQuery.trim() ? `in "${searchQuery}"` : `in ${currentLoc}`;
        return `${catText} ${locationText}`;
    };

    return (
        <section className="mt-8">
            <h2 className="mb-6 text-xl font-semibold capitalize text-text dark:text-white">
                {getHeaderText()}
            </h2>

            {properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                        No properties found
                    </p>
                    <p className="text-sm text-muted">
                        Try adjusting your filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {properties.map((p) => {
                        const images = p.media?.map(m => m.url) || [];
                        const location = `${p.city}, ${p.address_line}`;

                        return isCustomerView ? (
                            <CustomerPropertyCard
                                key={p.id}
                                {...p}
                                images={images}
                                location={location}
                                price={p.base_price}
                                rating={p.avg_rating}
                            />
                        ) : (
                            <PropertyCard
                                key={p.id}
                                {...p}
                                images={images}
                                location={location}
                                price={p.base_price}
                                rating={p.avg_rating}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}
