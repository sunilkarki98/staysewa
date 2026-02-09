"use client";

import clsx from "clsx";
import { useUserIntent } from "../../context/UserIntentContext";
import type { StayCategory } from "../../types/stay-types";

const TABS: { label: string; value: StayCategory }[] = [
    { label: "Hostels", value: "hostels" },
    { label: "Flats", value: "flats" },
    { label: "Homestays", value: "homestays" },
];

export default function StayTabs() {
    const { category, setCategory } = useUserIntent();

    return (
        <div className="flex rounded-full bg-gray-100 dark:bg-gray-800 p-1">
            {TABS.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setCategory(tab.value)}
                    className={clsx(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition",
                        category === tab.value
                            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
