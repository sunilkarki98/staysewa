import type { Metadata } from "next";
import { Suspense } from "react";
import StayListingSection from "@/components/sections/StayListingSection";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
    title: "Homestays in Kathmandu | StaySewa",
    description:
        "Discover authentic homestays in Kathmandu. Live with locals, enjoy comfort, and book verified homestays with StaySewa.",
    keywords: [
        "homestays in Kathmandu",
        "Kathmandu homestay",
        "local stays Nepal",
        "family homestays Kathmandu",
        "StaySewa homestays",
    ],
    openGraph: {
        title: "Homestays in Kathmandu | StaySewa",
        description:
            "Book authentic and verified homestays in Kathmandu with StaySewa. Comfortable, local, and affordable stays.",
        url: "https://staysewa.com/homestays",
        siteName: "StaySewa",
        type: "website",
    },
    alternates: {
        canonical: "https://staysewa.com/homestays",
    },
};

export default function HomestaysPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-neutral dark:bg-black">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text dark:text-white mb-2">Homestays</h1>
                    <p className="text-muted text-lg">Live like a local and experience authentic Nepali hospitality.</p>
                </div>
                <Suspense fallback={<div className="h-96 animate-pulse bg-stone-100 dark:bg-stone-900 rounded-xl" />}>
                    <StayListingSection selectedCategory="homestay" />
                </Suspense>
            </Container>
        </main>
    );
}
