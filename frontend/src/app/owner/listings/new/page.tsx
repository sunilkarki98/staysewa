"use client";

import { useState, SyntheticEvent } from "react";
import { ArrowLeftIcon, ImageIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

type ListingFormData = {
    name: string;
    type: "hostels" | "flats" | "homestays";
    intent: "short-stay" | "long-stay";
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

export default function AddListingPage() {
    const [formData, setFormData] = useState<ListingFormData>({
        name: "",
        type: "homestays",
        intent: "short-stay",
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            console.log("Listing submitted:", formData);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                    Listing Submitted!
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-md">
                    Your property has been submitted for review. You'll be notified once it's approved and live on StaySewa.
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/owner/listings"
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-sm"
                    >
                        View My Listings
                    </Link>
                    <button
                        onClick={() => { setSubmitted(false); setFormData({ name: "", type: "homestays", intent: "short-stay", location: "", address: "", price: "", description: "", amenities: [], rules: "", maxGuests: "", bedrooms: "1", bathrooms: "1", images: [] }); }}
                        className="px-5 py-2.5 text-sm font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                        Add Another
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
                        Add New Listing
                    </h1>
                    <p className="text-stone-500 text-sm mt-0.5">
                        Fill in the details to list your property on StaySewa
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                                <option value="homestays">Homestay</option>
                                <option value="hostels">Hostel</option>
                                <option value="flats">Flat / Apartment</option>
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
                                <option value="short-stay">Short Stay (per night)</option>
                                <option value="long-stay">Long Stay (per month)</option>
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
                            placeholder="Describe your property, what makes it special, the neighborhood, nearby attractions..."
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

                {/* Photos */}
                <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                        Photos
                    </h2>
                    <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <ImageIcon size={40} className="mx-auto text-stone-400 mb-3" />
                        <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                            Click to upload photos
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                            PNG, JPG up to 5MB each. Upload up to 10 photos.
                        </p>
                        <p className="text-xs text-stone-400 mt-3 italic">
                            (Photo upload will be available once backend is connected)
                        </p>
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
                        disabled={isSubmitting}
                        className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <PlusIcon size={16} weight="bold" />
                                Submit Listing
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
