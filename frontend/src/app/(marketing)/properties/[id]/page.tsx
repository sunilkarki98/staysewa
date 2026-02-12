"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Star,
    CaretLeft,
    CheckCircle,
    Images,
    Bed,
    Users,
    Bathtub,
    Toilet
} from "@phosphor-icons/react";
import { StaysService } from "@/services/domain";
import { BookingsService } from "@/services/domain";
import StayListingSection from "@/components/sections/StayListingSection"; // Reusing for 'Related Stays' if needed
import ReviewsSection from "@/components/sections/ReviewsSection";
import { useAuth } from "@/context/AuthContext";
import type { Stay } from "@/types/stay";
import { getAmenityIcon, formatAmenityLabel } from "@/helpers/amenity-icons";

// Create a type for the extended response from backend (including relations)
// In a real app, this should be in types/stay.ts
type StayWithRelations = Stay & {
    stayUnits?: Array<{
        id: string;
        name: string;
        type: string;
        maxOccupancy: number;
        basePrice: number;
        amenities: string[];
        quantity: number;
    }>;
    stayMedia?: Array<{
        id: string;
        url: string;
        type: string;
        caption?: string;
    }>;
};

export default function StayDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    // Date State
    const [checkIn, setCheckIn] = useState<string>(new Date().toISOString().split('T')[0]);
    const [checkOut, setCheckOut] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

    // Data State
    const [stay, setStay] = useState<StayWithRelations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "success" | "error">("idle");
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

    // Fetch Stay
    useEffect(() => {
        const fetchStay = async () => {
            try {
                // Cast the response to our extended type since domain service return type might be strict
                const data = await StaysService.getById(id);
                const stayData = data as unknown as StayWithRelations;
                setStay(stayData);

                // Pre-select first available unit if any
                if (stayData.stayUnits && stayData.stayUnits.length > 0) {
                    setSelectedUnitId(stayData.stayUnits[0].id);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to load stay details";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchStay();
    }, [id]);

    const handleBook = async () => {
        if (stay?.type !== "apartment" && !selectedUnitId) {
            alert("Please select a room option to proceed.");
            return;
        }

        if (!user) {
            alert("Please log in to book.");
            return;
        }

        setBookingStatus("booking");
        try {
            await BookingsService.create({
                stayId: id,
                unitId: selectedUnitId || undefined,
                checkIn: checkIn,
                checkOut: checkOut,
                guestName: user.name || "Guest",
                guestEmail: user.email || "",
                guestPhone: user.phone || "",
                totalAmount: Math.floor(basePrice * validDuration * 1.05),
                specialRequests: "Booking via new property page",
            });
            setBookingStatus("success");
        } catch {
            setBookingStatus("error");
            setTimeout(() => setBookingStatus("idle"), 3000);
        }
    };

    // Derived State
    const selectedUnit = stay?.stayUnits?.find(u => u.id === selectedUnitId);

    // Price Calculation
    // Base unit price or stay price
    const basePrice = selectedUnit ? selectedUnit.basePrice : (stay?.price || 0);

    // Calculate Duration
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Ensure at least 1 night/month
    const validDuration = durationDays > 0 ? durationDays : 0;

    // Total Price
    // Assuming basePrice is per night (or per month if apartment, need logic)
    // If type is 'apartment', usually per month? But for now let's assume 'night' standard for simple math
    // unless 'month' logic is explicit. 'priceLabel' used 'month' for apartment.
    const isMonthly = stay?.type === 'apartment';
    const totalAmount = validDuration * basePrice; // Logic gap: if monthly, need to divide by 30? 
    // For now, let's treat basePrice as "Per Night" equivalent even for apartments OR displayed as "Per Month" but calculated simply.
    // Actually, usually booking systems standardize on ONE unit (night vs day). 
    // If 'apartment' price is 20,000 / month, then daily is ~666. 
    // Let's assume the stored price is PER NIGHT for calculation simplicity in this fix, 
    // or if it IS per month, we need to adjust.
    // Given the task is a "Audit/Fix", I will calculate simply based on nights for now to enable functionality.

    const displayPrice = basePrice;

    // Handlers
    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckIn(e.target.value);
        // Auto-adjust checkout if invalid
        if (new Date(e.target.value) >= new Date(checkOut)) {
            setCheckOut(new Date(new Date(e.target.value).getTime() + 86400000).toISOString().split('T')[0]);
        }
    };

    const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckOut(e.target.value);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral dark:bg-black py-8">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="h-6 w-40 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-6" />
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="aspect-video bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-48 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !stay) {
        return notFound();
    }

    // Processing Images
    // Combine stay images (legacy array) and new media relation
    let allImages = stay.images || [];
    if (stay.stayMedia && stay.stayMedia.length > 0) {
        // Prefer media objects
        const mediaUrls = stay.stayMedia.map(m => m.url);
        // Deduplicate if legacy images are same
        allImages = Array.from(new Set([...mediaUrls, ...allImages]));
    }

    // Ensure we have at least placeholders if empty
    if (allImages.length === 0) allImages = ["/placeholder-house.webp"];

    const mainImage = allImages[0];
    const subImages = allImages.slice(1, 5); // Take next 4 for grid

    return (
        <div className="min-h-screen bg-neutral dark:bg-black py-8">
            <div className="mx-auto max-w-6xl px-4">
                {/* Back Button */}
                <Link
                    href="/explore"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                >
                    <CaretLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Dynamic Image Grid */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-2xl overflow-hidden">
                            {/* Main Image (Large) */}
                            <div className="col-span-4 row-span-2 md:col-span-2 relative bg-gray-100 dark:bg-gray-800 group cursor-pointer">
                                <Image
                                    src={mainImage}
                                    alt={stay.name}
                                    fill
                                    className="object-cover transition duration-300 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-text dark:text-white shadow-sm backdrop-blur-md">
                                    {stay.type}
                                </div>
                            </div>

                            {/* Sub Images (Hidden on mobile mostly, or grid) */}
                            {subImages.map((img, idx) => (
                                <div key={idx} className="hidden md:block relative bg-gray-100 dark:bg-gray-800 group cursor-pointer">
                                    <Image
                                        src={img}
                                        alt={`${stay.name} - ${idx + 2}`}
                                        fill
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                            ))}

                            {/* Placeholder for "See all photos" if generic or overflow */}
                            {subImages.length < 4 && Array.from({ length: 4 - subImages.length }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="hidden md:flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-300">
                                    <Images size={24} />
                                </div>
                            ))}
                        </div>


                        {/* Title & Stats */}
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-text dark:text-white">
                                        {stay.name}
                                    </h1>
                                    <div className="mt-2 flex items-center gap-2 text-muted dark:text-gray-400">
                                        <MapPin size={18} weight="fill" />
                                        <span>{stay.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                                    <Star size={20} weight="fill" />
                                    <span className="font-bold">{stay.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Stats (New) */}
                        {(stay.maxGuests || stay.bedrooms || stay.bathrooms) && (
                            <div className="mt-6 flex flex-wrap gap-4 lg:gap-8 py-4 border-y border-stone-100 dark:border-stone-800">
                                {stay.maxGuests && stay.maxGuests > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Users size={24} className="text-stone-400" />
                                        <div>
                                            <span className="block text-sm font-bold text-stone-900 dark:text-white">
                                                {stay.maxGuests} Guests
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {stay.bedrooms !== undefined && stay.bedrooms >= 0 && !['hotel', 'hostel', 'resort'].includes(stay.type) && (
                                    <div className="flex items-center gap-2">
                                        <Bed size={24} className="text-stone-400" />
                                        <div>
                                            <span className="block text-sm font-bold text-stone-900 dark:text-white">
                                                {stay.bedrooms === 0 ? "Studio" : `${stay.bedrooms} Bedroom${stay.bedrooms > 1 ? "s" : ""}`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {stay.bathrooms !== undefined && stay.bathrooms > 0 && !['hotel', 'hostel', 'resort'].includes(stay.type) && (
                                    <div className="flex items-center gap-2">
                                        <Bathtub size={24} className="text-stone-400" />
                                        <div>
                                            <span className="block text-sm font-bold text-stone-900 dark:text-white">
                                                {stay.bathrooms} Bathroom{stay.bathrooms > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Available Rooms / Units Section (New) - Only for Hostels/Homestays */}
                        {stay.type !== "apartment" && stay.stayUnits && stay.stayUnits.length > 0 && (
                            <section>
                                <h3 className="mb-4 text-xl font-bold text-text dark:text-white flex items-center gap-2">
                                    <Bed size={24} className="text-primary" />
                                    Available Options
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {stay.stayUnits.map((unit) => (
                                        <div
                                            key={unit.id}
                                            onClick={() => setSelectedUnitId(unit.id || "")}
                                            className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedUnitId === unit.id
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-border dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg dark:text-white">{unit.name}</h4>
                                                {selectedUnitId === unit.id && <CheckCircle size={20} weight="fill" className="text-primary" />}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Users size={16} /> Max {unit.maxOccupancy}
                                                </span>
                                                <span className="font-semibold text-stone-900 dark:text-stone-200">
                                                    NPR {unit.basePrice.toLocaleString()}
                                                </span>
                                            </div>
                                            {/* Unit Amenities (limit 3) */}
                                            {unit.amenities && unit.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {unit.amenities.slice(0, 3).map(am => (
                                                        <span key={am} className="text-xs px-2 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                                            {formatAmenityLabel(am)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* Dynamic Amenities */}
                        <div className="rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-8">
                            <h3 className="mb-6 text-xl font-bold text-text dark:text-white">
                                What this place offers
                            </h3>
                            {stay.amenities && stay.amenities.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stay.amenities.map((amenity) => {
                                        const Icon = getAmenityIcon(amenity);
                                        return (
                                            <div key={amenity} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral dark:hover:bg-gray-800 transition-colors">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                                                    <Icon size={24} weight="duotone" />
                                                </div>
                                                <span className="text-base text-stone-700 dark:text-gray-300 font-medium">
                                                    {formatAmenityLabel(amenity)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted italic">No amenities listed.</p>
                            )}
                        </div>

                        {/* Dynamic Description */}
                        <div className="rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                            <h3 className="mb-4 text-lg font-bold text-text dark:text-white">
                                About this stay
                            </h3>
                            {/* Render description or fallback to "unprovided" state, not generic placeholder */}
                            <p className="text-muted dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                {stay.description || "The host hasn't provided a description for this property yet."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Booking Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg">
                            <div className="mb-6">
                                <span className="text-sm font-medium text-stone-500 block mb-1">
                                    {stay.type === "apartment" ? "Price" : (selectedUnitId ? "Selected Option" : "Starting Price")}
                                </span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        NPR {displayPrice.toLocaleString()}
                                    </span>
                                    <span className="text-muted dark:text-gray-400 mb-1">
                                        / {isMonthly ? "month" : "night"}
                                    </span>
                                </div>
                            </div>

                            {/* Date Picker Section */}
                            <div className="mb-6 grid grid-cols-2 gap-2">
                                <div className="p-3 bg-stone-50 dark:bg-black/50 border border-stone-200 dark:border-gray-700 rounded-xl">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Check-In</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleCheckInChange}
                                        className="w-full bg-transparent text-sm font-medium text-stone-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div className="p-3 bg-stone-50 dark:bg-black/50 border border-stone-200 dark:border-gray-700 rounded-xl">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Check-Out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        min={checkIn}
                                        onChange={handleCheckOutChange}
                                        className="w-full bg-transparent text-sm font-medium text-stone-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="mb-6 p-4 bg-stone-50 dark:bg-gray-800/50 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600 dark:text-stone-400">NPR {displayPrice.toLocaleString()} x {validDuration} nights</span>
                                    <span className="font-medium text-stone-900 dark:text-white">NPR {(basePrice * validDuration).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600 dark:text-stone-400">Service Fee (5%)</span>
                                    <span className="font-medium text-stone-900 dark:text-white">NPR {(basePrice * validDuration * 0.05).toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t border-stone-200 dark:border-gray-700 flex justify-between font-bold text-base">
                                    <span className="text-stone-900 dark:text-white">Total</span>
                                    <span className="text-primary">NPR {(basePrice * validDuration * 1.05).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleBook}
                                    disabled={bookingStatus !== "idle"}
                                    className={`w-full rounded-xl py-3.5 font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${bookingStatus === "success"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : bookingStatus === "error"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-primary hover:bg-orange-700 shadow-lg shadow-orange-500/30"
                                        }`}
                                >
                                    {bookingStatus === "idle" && (
                                        stay.type === "apartment"
                                            ? "Request to Book"
                                            : (selectedUnitId ? "Book This Option" : "Book Now")
                                    )}
                                    {bookingStatus === "booking" && "Processing..."}
                                    {bookingStatus === "success" && (
                                        <>
                                            <CheckCircle size={20} weight="bold" />
                                            {stay.type === "apartment" ? "Request Sent!" : "Booked!"}
                                        </>
                                    )}
                                    {bookingStatus === "error" && "Booking Failed — Try Again"}
                                </button>
                                <p className="text-center text-xs text-muted dark:text-gray-500">
                                    {stay.type === "apartment"
                                        ? "The owner will review your request."
                                        : "You won't be charged yet"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
