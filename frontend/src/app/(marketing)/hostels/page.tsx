import type { Metadata } from "next";
import { Suspense } from "react";
import PropertyListingSection from "@/components/sections/PropertyListingSection";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Hostels in Kathmandu | StaySewa",
  description:
    "Discover verified hostels in Kathmandu. Transparent pricing, no brokerage, and easy booking with StaySewa.",
  keywords: [
    "hostels in Kathmandu",
    "Kathmandu hostels",
    "budget stays Nepal",
    "StaySewa",
  ],
  openGraph: {
    title: "Hostels in Kathmandu | StaySewa",
    description:
      "Book trusted hostels in Kathmandu with transparent pricing and instant booking.",
    url: "https://staysewa.com/hostels",
    siteName: "StaySewa",
    type: "website",
  },
};

export default function HostelsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-neutral dark:bg-black">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text dark:text-white mb-2">Hostels in Kathmandu</h1>
          <p className="text-muted text-lg">Social vibes and budget-friendly stays for travelers.</p>
        </div>
        <Suspense fallback={<div className="h-96 animate-pulse bg-stone-100 dark:bg-stone-900 rounded-xl" />}>
          <PropertyListingSection selectedCategory="hostel" />
        </Suspense>
      </Container>
    </main>
  );
}
