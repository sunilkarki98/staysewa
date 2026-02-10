"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { StayCategory } from "../types/stay-types";

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

    // Update category when pathname changes
    if (typeof window !== 'undefined') {
        const newCategory = getInitialCategory();
        if (newCategory !== category) {
            setCategory(newCategory);
        }
    }

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
