"use client";

import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const match = document.cookie.match(/theme=(dark|light)/);
        let initial: "light" | "dark" = "light";

        if (match) initial = match[1] as "light" | "dark";
        else initial = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
    }, []);

    if (!mounted) return null;

    function toggleTheme() {
        setTheme(prev => {
            const next = prev === "dark" ? "light" : "dark";
            document.documentElement.classList.toggle("dark", next === "dark");
            document.cookie = `theme=${next}; path=/; max-age=31536000`;
            return next;
        });
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 bg-white shadow-md hover:bg-gray-100 transition-all active:scale-95"
        >
            {theme === "dark" ? (
                <MoonIcon size={20} weight="fill" className="text-blue-600" />
            ) : (
                <SunIcon size={20} weight="fill" className="text-amber-500" />
            )}
        </button>
    );
}
