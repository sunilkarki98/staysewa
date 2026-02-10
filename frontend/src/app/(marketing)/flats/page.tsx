import type { Metadata } from "next";
import StayListingSection from "@/components/sections/StayListingSection";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
    title: "Flats for Rent in Kathmandu | StaySewa",
    description:
        "Browse short-term and long-term flats for rent in Kathmandu. Verified listings, no brokerage, and transparent pricing on StaySewa.",
    keywords: [
        "flats for rent in Kathmandu",
        "Kathmandu flats",
        "apartments in Kathmandu",
        "short term flats Nepal",
        "StaySewa flats",
    ],
    openGraph: {
        title: "Flats for Rent in Kathmandu | StaySewa",
        description:
            "Find verified flats and apartments for rent in Kathmandu. No brokerage fees, easy booking with StaySewa.",
        url: "https://staysewa.com/flats",
        siteName: "StaySewa",
        type: "website",
    },
    alternates: {
        canonical: "https://staysewa.com/flats",
    },
};

export default function FlatsPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-neutral dark:bg-black">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text dark:text-white mb-2">Flats & Apartments</h1>
                    <p className="text-muted text-lg">Comfortable, private spaces for short or long term living.</p>
                </div>
                <StayListingSection selectedCategory="flats" />
            </Container>
        </main>
    );
}
