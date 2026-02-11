"use client";

import { usePathname } from "next/navigation";
import type { StayCategory, StayIntent } from "../types/stay";

export type StayType = { category: StayCategory; intent: StayIntent };

export function useStayType(): StayType {
  const pathname = usePathname();

  if (pathname.startsWith("/flats"))
    return { category: "apartment", intent: "long_stay" };
  if (pathname.startsWith("/homestays"))
    return { category: "homestay", intent: "short_stay" };

  // default
  return { category: "hostel", intent: "short_stay" };
}
