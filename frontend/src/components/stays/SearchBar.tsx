"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useUserIntent } from "../../context/UserIntentContext";


type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
    const { category } = useUserIntent();

    const placeholder =
        category === "apartment"
            ? "Search apartments by area or landmark"
            : category === "homestay"
                ? "Search homestays or hosts"
                : category === "hostel"
                    ? "Search hostels or locations"
                    : "Search all stays";

    return (
        <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <MagnifyingGlassIcon size={18} className="text-gray-400" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-sm outline-none"
            />
        </div>
    );
}
