"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOut, User } from "@phosphor-icons/react";

import { useAuth } from "@/context/AuthContext";

export function ProfileMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    // Get initials
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 rounded-full bg-primary text-sm font-medium text-white flex items-center justify-center"
            >
                {initials}
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl
                        border bg-white shadow-lg
                        dark:border-gray-800 dark:bg-black z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>

                    <Link
                        href="/profile"
                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                        onClick={() => setOpen(false)}
                    >
                        <User size={16} className="inline mr-2" /> Profile
                    </Link>

                    {user?.role !== "owner" && (
                        <Link
                            href="/my-bookings"
                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} className="inline mr-2" /> My Bookings
                        </Link>
                    )}

                    {user?.role === "owner" && (
                        <Link
                            href="/owner"
                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} className="inline mr-2" /> Owner Dashboard
                        </Link>
                    )}

                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                        <SignOut size={16} className="inline mr-2" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}
