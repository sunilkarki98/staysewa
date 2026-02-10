"use client";

import Container from "../../components/layout/Container";
import { useState, useMemo } from "react";
import { User, MapPin, CaretDown } from "@phosphor-icons/react";
import StayListingSection from "../../components/sections/StayListingSection";
import { StayCategory } from "../../types/stay-types";
import { motion } from "framer-motion";
import { MOCK_STAYS } from "../../data/stays";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<StayCategory | "all">("all");
    const [location, setLocation] = useState("all");

    const tabs: (StayCategory | "all")[] = ["all", "hostels", "flats", "homestays"];

    // Extract unique locations (same logic as ListingSection, could be shared util)
    const locations = useMemo(() => {
        const locs = new Set(MOCK_STAYS.map(s => s.location));
        return Array.from(locs).sort();
    }, []);

    return (
        <div className="min-h-screen bg-neutral dark:bg-black pb-20">
            <Container className="py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text dark:text-white">
                            Welcome back, Traveler! 👋
                        </h1>
                        <p className="mt-1 text-muted dark:text-gray-400">
                            Find your perfect stay in Kathmandu today.
                        </p>
                    </div>

                    {/* Location Selector (Replaces Avatar) */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-border dark:border-gray-800 shadow-sm cursor-pointer hover:border-primary transition-colors">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin size={16} weight="fill" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-muted uppercase tracking-wide">Location</span>
                                <span className="text-sm font-semibold text-text dark:text-white max-w-[120px] truncate">
                                    {location === "all" ? "All Kathmandu" : location}
                                </span>
                            </div>
                            <CaretDown size={14} className="text-muted" weight="bold" />

                            {/* Hidden Select Overlay */}
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                <option value="all">All Kathmandu</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Single Unified Listings */}
                <div className="min-h-[500px]">
                    <StayListingSection
                        isCustomerView={true}
                        selectedCategory={activeTab}
                        onCategoryChange={setActiveTab}
                        externalLocation={location}
                        onExternalLocationChange={setLocation}
                    />
                </div>
            </Container>
        </div>
    );
}
