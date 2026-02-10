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
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-10">
                            <Link href="/"
                                className="text-2xl font-bold transition-colors text-primary"
                            >
                                StaySewa
                            </Link>

                            <nav className={`hidden md:flex items-center gap-8 ${isLandingPage
                                ? "bg-stone-900/30 backdrop-blur-md rounded-full px-8 py-2 border border-white/10 shadow-lg"
                                : ""
                                }`}>
                                {navLinks.map((link) => {
                                    const active = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`text-lg font-medium transition ${isLandingPage
                                                ? "text-stone-100 hover:text-white"
                                                : active
                                                    ? "text-primary dark:text-primary"
                                                    : "text-muted hover:text-text dark:text-muted dark:hover:text-text"
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
                                        className="text-base font-medium transition text-muted hover:text-primary dark:text-muted dark:hover:text-primary"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="rounded-full bg-gradient-to-r from-primary to-orange-700 px-6 py-2.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 transition-all hover:scale-105"
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
