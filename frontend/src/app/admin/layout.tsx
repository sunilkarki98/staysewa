"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChartBar,
    Users,
    CalendarCheck,
    SignOut,
    ShieldCheck,
    List,
    MagnifyingGlass,
    Bell,
} from "@phosphor-icons/react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: ChartBar },
    { label: "Owners", href: "/admin/owners", icon: Users },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-40 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                {/* Logo */}
                <div className="flex items-center gap-2.5 h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                    <ShieldCheck size={28} weight="fill" className="text-indigo-600" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        StaySewa <span className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full ml-1">Admin</span>
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <item.icon size={20} weight={isActive ? "fill" : "regular"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <SignOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 w-full">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6">
                    <button className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400">
                        <List size={24} />
                    </button>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-md">
                        <MagnifyingGlass size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search owners, bookings..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <ThemeToggle />
                        <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            A
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
