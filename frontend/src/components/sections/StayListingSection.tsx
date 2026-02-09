"use client";

import { useState, useCallback } from "react";
import SearchBar from "../stays/SearchBar";
import SortBar, { SortOption } from "../stays/SortBar";
import StayGrid from "../stays/StayGrid";

export default function StayListingSection() {
    const [sort, setSort] = useState<SortOption>("recommended");

    const handleSortChange = useCallback((value: SortOption) => {
        setSort(value);
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar />
                <SortBar value={sort} onChange={handleSortChange} />
            </div>

            <StayGrid sort={sort} />
        </section>
    );
}
