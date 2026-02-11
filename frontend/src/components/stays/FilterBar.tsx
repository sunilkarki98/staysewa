"use client";

import { MagnifyingGlass, MapPin, Funnel, SortAscending } from "@phosphor-icons/react";
import { StayIntent, StayCategory } from "../../types/stay";
import { SortOption } from "./SortBar";
import { motion } from "framer-motion";

type FilterBarProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    locationFilter: string;
    onLocationChange: (value: string) => void;
    sort: SortOption;
    onSortChange: (value: SortOption) => void;
    intentFilter: StayIntent | "all";
    onIntentChange: (value: StayIntent | "all") => void;
    locations: string[]; // List of available locations
    hideLocation?: boolean;
    activeCategory?: StayCategory | "all";
    onCategoryChange?: (value: StayCategory | "all") => void;
};

export default function FilterBar({
    searchQuery,
    onSearchChange,
    locationFilter,
    onLocationChange,
    sort,
    onSortChange,
    intentFilter,
    onIntentChange,
    locations,
    hideLocation = false,
    activeCategory,
    onCategoryChange,
}: FilterBarProps) {
    const tabs: (StayCategory | "all")[] = ["all", "hostel", "apartment", "homestay"];

    return (
        <div className="flex flex-col xl:flex-row items-center gap-4 p-2 rounded-2xl bg-white dark:bg-gray-900 border border-border dark:border-gray-800 shadow-sm">

            {/* Category Tabs (Integrated) */}
            {activeCategory && onCategoryChange && (
                <div className="flex items-center bg-stone-100 dark:bg-gray-800/50 rounded-xl p-1 shrink-0 overflow-x-auto max-w-full no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onCategoryChange(tab)}
                            className={`
                                relative px-4 py-2 text-xs font-bold rounded-lg transition-all z-10 whitespace-nowrap
                                ${activeCategory === tab
                                    ? "text-white"
                                    : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-gray-700/50"}
                            `}
                        >
                            {activeCategory === tab && (
                                <motion.div
                                    layoutId="filterBarTab"
                                    className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 capitalize">
                                {tab === "all" ? "All" : tab}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Separator (Hidden on mobile) */}
            <div className="hidden xl:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

            {/* Search Input (Grow) */}
            <div className="relative flex-1 w-full xl:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlass size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search stays..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-stone-50 dark:bg-black/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
            </div>

            {/* Location Select (Hidden if external control) */}
            {!hideLocation && (
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                    </div>
                    <select
                        value={locationFilter}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-stone-50 dark:bg-black/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm appearance-none cursor-pointer transition-colors"
                    >
                        <option value="all">Everywhere</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Funnel size={14} weight="bold" />
                    </div>
                </div>
            )}

            {/* Duration Tabs */}
            <div className="flex items-center gap-2 p-1 bg-stone-50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
                <button
                    onClick={() => onIntentChange("all")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${intentFilter === "all"
                        ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                >
                    Any
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <button
                    onClick={() => onIntentChange("short_stay")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${intentFilter === "short_stay"
                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                >
                    Short
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <button
                    onClick={() => onIntentChange("long_stay")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${intentFilter === "long_stay"
                        ? "bg-white dark:bg-gray-800 text-purple-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                >
                    Long
                </button>
            </div>

            {/* Sort Select */}
            <div className="relative w-full md:w-48 shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SortAscending size={18} className="text-gray-400" />
                </div>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="block w-full pl-10 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-stone-50 dark:bg-black/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm appearance-none cursor-pointer transition-colors"
                >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <div className="h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-gray-400" />
                </div>
            </div>
        </div>
    );
}
