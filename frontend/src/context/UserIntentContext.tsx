"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { StayCategory } from "../types/stay";

type CategoryFilter = StayCategory | "all";

type UserIntentContextType = {
    category: CategoryFilter;
    setCategory: (category: CategoryFilter) => void;
};

const UserIntentContext = createContext<UserIntentContextType | null>(null);

export function UserIntentProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Determine initial category from pathname
    const getInitialCategory = (): CategoryFilter => {
        if (pathname.startsWith("/flats")) return "flats";
        if (pathname.startsWith("/homestays")) return "homestays";
        if (pathname.startsWith("/hostels")) return "hostels";
        return "all"; // Default to all (e.g. for /dashboard or /explore)
    };

    const [category, setCategory] = useState<CategoryFilter>(getInitialCategory());

    // Sync category with URL changes
    useEffect(() => {
        setCategory(getInitialCategory());
    }, [pathname]);

    return (
        <UserIntentContext.Provider value={{ category, setCategory }}>
            {children}
        </UserIntentContext.Provider>
    );
}

export function useUserIntent(): UserIntentContextType {
    const ctx = useContext(UserIntentContext);
    if (!ctx) {
        throw new Error("useUserIntent must be used inside UserIntentProvider");
    }
    return ctx;
}
