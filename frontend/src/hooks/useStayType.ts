"use client";

import { usePathname } from "next/navigation";
import type { StayType } from "../types/stay";

export function useStayType(): StayType {
  const pathname = usePathname();

  if (pathname.startsWith("/flats"))
    return { category: "flats", intent: "short-stay" };
  if (pathname.startsWith("/homestays"))
    return { category: "homestays", intent: "short-stay" };

  // default
  return { category: "hostels", intent: "short-stay" };
}
