"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPinIcon,
    StarIcon,
    WifiHighIcon,
    ShowerIcon,
    CoffeeIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    CaretLeftIcon,
} from "@phosphor-icons/react";
import { MOCK_STAYS } from "@/data/stays";

export default function StayDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const stay = MOCK_STAYS.find((s) => s.id === id);
    const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "success">("idle");

    if (!stay) {
        return notFound();
    }

    const handleBook = () => {
        setBookingStatus("booking");
        // Simulate API call
        setTimeout(() => {
            setBookingStatus("success");
            // Reset after 3 seconds
            setTimeout(() => setBookingStatus("idle"), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral dark:bg-black py-8">
            <div className="mx-auto max-w-6xl px-4">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                >
                    <CaretLeftIcon size={18} />
                    Back to Dashboard
                </Link>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery (Main + Thumbnails mock) */}
                        <div className="overflow-hidden rounded-2xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                            <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
                                <Image
                                    src={stay.images[0]}
                                    alt={stay.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-text dark:text-white shadow-sm backdrop-blur-md">
                                    {stay.type.slice(0, -1)}
                                </div>
                            </div>
                        </div>

                        {/* Title & Stats */}
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-text dark:text-white">
                                        {stay.name}
                                    </h1>
                                    <div className="mt-2 flex items-center gap-2 text-muted dark:text-gray-400">
                                        <MapPinIcon size={18} weight="fill" />
                                        <span>{stay.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                                    <StarIcon size={20} weight="fill" />
                                    <span className="font-bold">{stay.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Amenities Mock */}
                        <div className="rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-8">
                            <h3 className="mb-6 text-xl font-bold text-text dark:text-white">
                                What this place offers
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                        <WifiHighIcon size={24} weight="duotone" />
                                    </div>
                                    <span className="text-base text-stone-700 dark:text-gray-300 font-medium">Fast Wifi</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                                        <ShowerIcon size={24} weight="duotone" />
                                    </div>
                                    <span className="text-base text-stone-700 dark:text-gray-300 font-medium">Hot Shower</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                        <CoffeeIcon size={24} weight="duotone" />
                                    </div>
                                    <span className="text-base text-stone-700 dark:text-gray-300 font-medium">Breakfast Included</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                        <ShieldCheckIcon size={24} weight="duotone" />
                                    </div>
                                    <span className="text-base text-stone-700 dark:text-gray-300 font-medium">24/7 Security</span>
                                </div>
                            </div>
                        </div>

                        {/* Description Mock */}
                        <div className="rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                            <h3 className="mb-4 text-lg font-bold text-text dark:text-white">
                                About this stay
                            </h3>
                            <p className="text-muted dark:text-gray-400 leading-relaxed">
                                Experience a comfortable stay in the heart of Kathmandu. This {stay.type.slice(0, -1)} offers
                                modern amenities, a vibrant community atmosphere, and easy access to local attractions.
                                Perfect for travelers and digital nomads alike.
                            </p>
                        </div>
                    </div>

                    {/* Right: Booking Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg">
                            <div className="mb-6 flex items-end gap-2">
                                <span className="text-3xl font-bold text-primary">
                                    NPR {stay.price.toLocaleString()}
                                </span>
                                <span className="text-muted dark:text-gray-400 mb-1">
                                    / {stay.type === "flats" ? "month" : "night"}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleBook}
                                    disabled={bookingStatus !== "idle"}
                                    className={`w-full rounded-xl py-3.5 font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${bookingStatus === "success"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-primary hover:bg-orange-700 shadow-lg shadow-orange-500/30"
                                        }`}
                                >
                                    {bookingStatus === "idle" && "Book Now"}
                                    {bookingStatus === "booking" && "Processing..."}
                                    {bookingStatus === "success" && (
                                        <>
                                            <CheckCircleIcon size={20} weight="bold" />
                                            Booked!
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-muted dark:text-gray-500">
                                    You won't be charged yet
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
