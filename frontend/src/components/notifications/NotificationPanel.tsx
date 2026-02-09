"use client";

import { X } from "phosphor-react";

export function NotificationPanel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Panel */}
            <aside
                className="absolute right-0 top-0 h-full w-96 bg-white
                    shadow-xl dark:bg-black"
            >
                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6 text-sm text-gray-600 dark:text-gray-400">
                    No new notifications yet.
                </div>
            </aside>
        </div>
    );
}
