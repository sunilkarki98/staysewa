"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOut, User } from "phosphor-react";

export function ProfileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 rounded-full bg-primary text-sm font-medium text-white"
            >
                CS
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl
                        border bg-white shadow-lg
                        dark:border-gray-800 dark:bg-black">
                    <Link
                        href="/profile"
                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                        <User size={16} /> Profile
                    </Link>

                    <button className="block w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <SignOut size={16} /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}
