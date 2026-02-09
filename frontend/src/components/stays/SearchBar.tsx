"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useUserIntent } from "../../context/UserIntentContext";
import { useState } from "react";

export default function SearchBar() {
    const { category } = useUserIntent();
    const [query, setQuery] = useState("");

    const placeholder =
        category === "flats"
            ? "Search flats by area or landmark"
            : category === "homestays"
                ? "Search homestays or hosts"
                : "Search hostels or locations";

    return (
        <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <MagnifyingGlassIcon size={18} className="text-gray-400" />
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full text-sm outline-none"
            />
        </div>
    );
}
