"use client";

import Sidebar from "@/components/owner/Sidebar";
import { ListIcon, BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-stone-50 dark:bg-black">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 transition-all w-full">
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-6 shadow-sm">
                    {/* Mobile Menu Button - Placeholder */}
                    <button className="md:hidden p-2 -ml-2 text-stone-600 dark:text-stone-400">
                        <ListIcon size={24} />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg w-full max-w-md">
                        <MagnifyingGlassIcon size={18} className="text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search bookings, listings..."
                            className="bg-transparent border-none outline-none text-sm w-full text-stone-700 dark:text-stone-200 placeholder:text-stone-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <ThemeToggle />
                        <button className="relative p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                            <BellIcon size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-stone-900" />
                        </button>

                        <div className="h-8 w-8 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                            <Image
                                src="https://i.pravatar.cc/150?img=12"
                                alt="Owner Profile"
                                width={32}
                                height={32}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
