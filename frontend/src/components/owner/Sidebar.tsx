"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HouseIcon, ListDashesIcon, CalendarCheckIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { name: "Overview", href: "/owner", icon: HouseIcon },
    { name: "My Listings", href: "/owner/listings", icon: ListDashesIcon },
    { name: "Bookings", href: "/owner/bookings", icon: CalendarCheckIcon },
    { name: "Settings", href: "/owner/settings", icon: GearIcon },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col z-40 hidden md:flex">
            {/* Logo Area */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                    StaySewa<span className="text-stone-400">.</span>
                </Link>
                <p className="text-xs text-stone-500 mt-1 font-medium px-0.5">OWNER DASHBOARD</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                                ${isActive
                                    ? "text-primary bg-orange-50 dark:bg-primary/10"
                                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200"}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <Icon size={20} weight={isActive ? "fill" : "regular"} className={isActive ? "text-primary" : ""} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-stone-100 dark:border-stone-800">
                <button className="flex items-center gap-3 w-full p-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-colors text-sm font-medium">
                    <SignOutIcon size={20} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
