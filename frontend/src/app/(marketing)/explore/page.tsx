import type { Metadata } from "next";
import { Suspense } from "react";
import StayListingSection from "@/components/sections/StayListingSection";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
    title: "Explore All Stays | StaySewa",
    description: "Browse all hostels, flats, and homestays in Kathmandu. Find your perfect stay with StaySewa.",
};

export default function ExplorePage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-neutral dark:bg-black">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text dark:text-white mb-2">Explore Stays</h1>
                    <p className="text-muted text-lg">Find your perfect home away from home in Kathmandu.</p>
                </div>
                <Suspense fallback={<StayListingSkeleton />}>
                    <StayListingSection />
                </Suspense>
            </Container>
        </main>
    );
}

function StayListingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-14 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}
