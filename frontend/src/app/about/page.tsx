import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/layout/Footer";

export const metadata: Metadata = {
    title: "About Us | StaySewa",
    description:
        "Learn about StaySewa - your trusted platform for finding affordable hostels, flats, and homestays in Kathmandu, Nepal.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <main className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    About StaySewa
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                        StaySewa is Nepal&apos;s premier platform for finding affordable and verified
                        accommodations in Kathmandu. Whether you&apos;re a backpacker looking for a
                        budget-friendly hostel, a professional seeking a short-term flat, or a
                        traveler wanting an authentic homestay experience, we&apos;ve got you covered.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        To make finding quality accommodation in Nepal simple, transparent, and
                        hassle-free. We believe everyone deserves a comfortable place to stay
                        without hidden fees or brokerage charges.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">
                        What We Offer
                    </h2>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                        <li>Verified hostels with transparent pricing</li>
                        <li>Short-term and long-term flats for rent</li>
                        <li>Authentic homestay experiences</li>
                        <li>No brokerage fees</li>
                        <li>Real guest reviews and ratings</li>
                    </ul>

                    <div className="mt-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                        >
                            Explore Stays
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
