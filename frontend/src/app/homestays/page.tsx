import type { Metadata } from "next";
import StayListingSection from "../../components/sections/StayListingSection";

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
    return <StayListingSection />;
}
