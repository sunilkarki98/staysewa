import type { Metadata } from "next";
import StayListingSection from "../../components/sections/StayListingSection";

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
  return <StayListingSection />;
}
