"use client";

import { usePathname } from "next/navigation";
import type { PropertyCategory } from "../types/property";

export type PropertyType = { category: PropertyCategory };

export function usePropertyType(): PropertyType {
    const pathname = usePathname();

    if (pathname.startsWith("/flats"))
        return { category: "apartment" };
    if (pathname.startsWith("/homestays"))
        return { category: "homestay" };

    // default
    return { category: "hostel" };
}
