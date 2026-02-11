"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, ImageIcon, FloppyDisk } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { StaysService } from "@/services/domain";
import type { StayCategory, StayIntent } from "@/types/stay";

type ListingFormData = {
    name: string;
    type: StayCategory;
    intent: StayIntent;
    location: string;
    address: string;
    price: string;
    description: string;
    amenities: string[];
    rules: string;
    maxGuests: string;
    bedrooms: string;
    bathrooms: string;
    images: string[];
};

const AMENITY_OPTIONS = [
    "WiFi", "Hot Water", "AC", "Parking", "Kitchen", "Laundry",
    "TV", "Garden", "Balcony", "Security", "CCTV", "Power Backup",
];

export default function EditListingPage() {
    const params = useParams();
    const router = useRouter();
    const listingId = params.id as string;

    const [formData, setFormData] = useState<ListingFormData>({
        name: "",
        type: "homestay",
        intent: "short_stay",
        location: "",
        address: "",
        price: "",
        description: "",
        amenities: [],
        rules: "",
        maxGuests: "",
        bedrooms: "1",
        bathrooms: "1",
        images: [],
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch listing from API
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listing = await StaysService.getById(listingId);
                setFormData({
                    name: listing.name,
                    type: listing.type,
                    intent: listing.intent,
                    location: listing.location,
                    address: "",
                    price: listing.price.toString(),
                    description: listing.description || `A wonderful ${listing.type.slice(0, -1)} located in ${listing.location}.`,
                    amenities: listing.amenities || ["WiFi", "Hot Water"],
                    rules: listing.rules?.join("\n") || "",
                    maxGuests: "4",
                    bedrooms: listing.type === "hostel" ? "1" : "2",
                    bathrooms: "1",
                    images: listing.images,
                });
            } catch {
                setNotFound(true);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchListing();
    }, [listingId]);

    const handleChange = (field: keyof ListingFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleAmenity = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await StaysService.update(listingId, {
                name: formData.name,
                type: formData.type,
                intent: formData.intent,
                location: formData.location,
                price: Number(formData.price),
                description: formData.description,
                amenities: formData.amenities,
                rules: formData.rules.split("\n").filter(Boolean),
            });
            setSaved(true);
        } catch (err) {
            console.error("Failed to update listing:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
                <div className="h-48 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                    Listing Not Found
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-6">
                    The listing you&apos;re trying to edit doesn&apos;t exist.
                </p>
                <Link
                    href="/owner/listings"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-sm"
                >
                    Back to Listings
                </Link>
            </div>
        );
    }

    if (saved) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                    Changes Saved!
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-md">
                    Your listing &quot;{formData.name}&quot; has been updated successfully.
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/owner/listings"
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-sm"
                    >
                        View My Listings
                    </Link>
                    <button
                        onClick={() => setSaved(false)}
                        className="px-5 py-2.5 text-sm font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                        Continue Editing
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/owner/listings"
                    className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                    <ArrowLeftIcon size={20} weight="bold" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Edit Listing
                    </h1>
                    <p className="text-stone-500 text-sm mt-0.5">
                        Update details for &quot;{formData.name}&quot;
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Current Images Preview */}
                {formData.images.length > 0 && (
                    <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                            Current Photos
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                                    <Image
                                        src={img}
                                        alt={`Listing photo ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                            <div className="aspect-video rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                <div className="text-center">
                                    <ImageIcon size={24} className="mx-auto text-stone-400 mb-1" />
                                    <p className="text-xs text-stone-400 font-medium">Add More</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Basic Info */}
                <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        Basic Information
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Property Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g. Cozy Mountain Homestay"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Property Type *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            >
                                <option value="homestay">Homestay</option>
                                <option value="hostel">Hostel</option>
                                <option value="hotel">Hotel</option>
                                <option value="apartment">Apartment</option>
                                <option value="room">Room</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Stay Intent *
                            </label>
                            <select
                                value={formData.intent}
                                onChange={(e) => handleChange("intent", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            >
                                <option value="short_stay">Short Stay (per night)</option>
                                <option value="long_stay">Long Stay (per month)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Describe your property..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
                        />
                    </div>
                </section>

                {/* Location & Pricing */}
                <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        Location & Pricing
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Area / Neighborhood *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                placeholder="e.g. Thamel, Kathmandu"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Full Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                placeholder="Street address (optional)"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Price (NPR) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                placeholder="e.g. 1500"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Bedrooms
                            </label>
                            <select
                                value={formData.bedrooms}
                                onChange={(e) => handleChange("bedrooms", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            >
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Bathrooms
                            </label>
                            <select
                                value={formData.bathrooms}
                                onChange={(e) => handleChange("bathrooms", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            >
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Max Guests
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.maxGuests}
                            onChange={(e) => handleChange("maxGuests", e.target.value)}
                            placeholder="e.g. 4"
                            className="w-full sm:w-32 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                </section>

                {/* Amenities */}
                <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        Amenities
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map((amenity) => {
                            const selected = formData.amenities.includes(amenity);
                            return (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selected
                                        ? "bg-primary/10 border-primary text-primary dark:bg-primary/20"
                                        : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600"
                                        }`}
                                >
                                    {amenity}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* House Rules */}
                <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        House Rules
                    </h2>
                    <textarea
                        value={formData.rules}
                        onChange={(e) => handleChange("rules", e.target.value)}
                        placeholder="e.g. No smoking, quiet hours after 10 PM, no pets..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
                    />
                </section>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2 pb-8">
                    <Link
                        href="/owner/listings"
                        className="px-5 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FloppyDisk size={16} weight="bold" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
