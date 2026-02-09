"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import ThemeToggle from "../theme/ThemeToggle";
import { ProfileMenu } from "../auth/ProfileMenu";
import { NotificationBell } from "../notifications/NotificationBell";
import { NotificationPanel } from "../notifications/NotificationPanel";

export default function Navbar() {
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);

    // TEMP: replace later with real auth
    const isAuthenticated = false;

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const isLandingPage = pathname === "/";

    return (
        <>
            <header
                className={`transition-all duration-300 ${isLandingPage
                    ? "absolute top-4 left-0 w-full z-50 bg-transparent"
                    : "sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80"
                    }`}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-10">
                            <Link href="/"
                                className="text-2xl font-bold transition-colors text-blue-600"
                            >
                                StaySewas
                            </Link>

                            <nav className={`hidden md:flex items-center gap-8 ${isLandingPage
                                ? "bg-white/10 backdrop-blur-md rounded-full px-8 py-2 border border-white/20 shadow-lg"
                                : ""
                                }`}>
                                {navLinks.map((link) => {
                                    const active = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`text-lg font-medium transition ${isLandingPage
                                                ? "text-white/90 hover:text-white"
                                                : active
                                                    ? "text-black dark:text-white"
                                                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated && (
                                <NotificationBell
                                    count={1}
                                    onClick={() => setShowNotifications(true)}
                                />
                            )}

                            <ThemeToggle />

                            {isAuthenticated ? (
                                <ProfileMenu />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="text-base font-medium transition text-blue-600 hover:text-blue-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 text-base font-semibold text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {isAuthenticated && (
                <NotificationPanel
                    open={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            )}
        </>
    );
}
