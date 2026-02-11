"use client";

import {
    Buildings,
    House,
    Bed,
    DoorOpen,
    Users,
} from "@phosphor-icons/react";
import type { StayCategory } from "@/types/stay";
import type { ComponentType } from "react";

interface PropertyTypeSelectorProps {
    selected: StayCategory | null;
    onSelect: (type: StayCategory) => void;
}

type PropertyOption = {
    type: StayCategory;
    title: string;
    description: string;
    icon: ComponentType<{ size?: number; weight?: string; className?: string }>;
    tags: string[];
};

const PROPERTY_OPTIONS: PropertyOption[] = [
    {
        type: "hotel",
        title: "Hotel",
        description: "Multiple rooms with dedicated service, reception, and amenities for guests.",
        icon: Buildings,
        tags: ["Rooms", "Service Staff", "Reception"],
    },
    {
        type: "hostel",
        title: "Hostel",
        description: "Budget-friendly shared or private rooms, perfect for backpackers and travelers.",
        icon: Bed,
        tags: ["Dorm Beds", "Shared Spaces", "Budget"],
    },
    {
        type: "homestay",
        title: "Homestay",
        description: "A home shared with guests — offering local culture and a personal touch.",
        icon: House,
        tags: ["Local Experience", "Personal", "Cultural"],
    },
    {
        type: "apartment",
        title: "Apartment",
        description: "Self-contained unit ideal for long-term stays with full kitchen and privacy.",
        icon: DoorOpen,
        tags: ["Full Kitchen", "Private", "Long-Term"],
    },
    {
        type: "room",
        title: "Room",
        description: "A single room for rent — simple, private, and affordable.",
        icon: Users,
        tags: ["Single Room", "Simple", "Affordable"],
    },
];

export default function PropertyTypeSelector({ selected, onSelect }: PropertyTypeSelectorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                    What type of property are you listing?
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    Choose the category that best describes your property. This determines what details we&apos;ll ask for.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROPERTY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selected === option.type;

                    return (
                        <button
                            key={option.type}
                            type="button"
                            onClick={() => onSelect(option.type)}
                            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected
                                    ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/10"
                                    : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-primary/40 hover:shadow-md"
                                }`}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${isSelected
                                    ? "bg-primary/10 text-primary"
                                    : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:text-primary group-hover:bg-primary/10"
                                }`}>
                                <Icon size={28} weight="duotone" />
                            </div>

                            <h3 className={`text-lg font-bold mb-1 transition-colors ${isSelected ? "text-primary" : "text-stone-900 dark:text-white"
                                }`}>
                                {option.title}
                            </h3>

                            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 leading-relaxed">
                                {option.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {option.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${isSelected
                                                ? "bg-primary/10 text-primary"
                                                : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
