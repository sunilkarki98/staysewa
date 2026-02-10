import type { Metadata } from "next";
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
                <StayListingSection />
            </Container>
        </main>
    );
}
