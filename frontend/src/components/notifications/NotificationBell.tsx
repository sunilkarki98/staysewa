"use client";

import { Bell } from "@phosphor-icons/react";

export function NotificationBell({
    onClick,
    count = 0,
}: {
    onClick: () => void;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            <Bell size={22} />

            {count > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
                    {count}
                </span>
            )}
        </button>
    );
}
