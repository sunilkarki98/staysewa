"use client";

import type { StayCategory, StayIntent } from "@/types/stay";

export interface BasicDetailsData {
    name: string;
    description: string;
    intent: StayIntent;
    city: string;
    district: string;
    addressLine: string;
    province: string;
}

interface BasicDetailsFormProps {
    data: BasicDetailsData;
    propertyType: StayCategory;
    onChange: (data: BasicDetailsData) => void;
}

const DISTRICTS = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan",
    "Lumbini", "Jhapa", "Morang", "Sunsari", "Kaski", "Nepalgunj",
    "Rupandehi", "Banke", "Kailali", "Surkhet", "Dang",
];

export default function BasicDetailsForm({ data, propertyType, onChange }: BasicDetailsFormProps) {
    const update = (field: keyof BasicDetailsData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    // Default intent based on property type
    const defaultIntents: Record<StayCategory, StayIntent> = {
        hotel: "short_stay",
        hostel: "short_stay",
        homestay: "both",
        apartment: "long_stay",
        room: "long_stay",
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                    Tell us about your property
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    Basic information that guests will see when browsing.
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Property Details
                </h3>

                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                        Property Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={data.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder={
                            propertyType === "hotel" ? "e.g. Hotel Everest View" :
                                propertyType === "hostel" ? "e.g. Backpackers Haven" :
                                    propertyType === "apartment" ? "e.g. Sunrise Apartment" :
                                        propertyType === "room" ? "e.g. Cozy Private Room" :
                                            "e.g. Mountain View Homestay"
                        }
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                        Description *
                    </label>
                    <textarea
                        required
                        value={data.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Describe your property — what makes it special, the neighborhood, nearby attractions..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                        {data.description.length}/500 characters
                    </p>
                </div>

                {/* Intent */}
                <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                        Stay Duration
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {([
                            { value: "short_stay", label: "Short Stay", desc: "Per night" },
                            { value: "long_stay", label: "Long Stay", desc: "Per month" },
                            { value: "both", label: "Both", desc: "Flexible" },
                        ] as const).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => update("intent", option.value)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${data.intent === option.value
                                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                                    : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                                    }`}
                            >
                                <span className={`block text-sm font-bold ${data.intent === option.value ? "text-primary" : "text-stone-900 dark:text-white"
                                    }`}>
                                    {option.label}
                                </span>
                                <span className="block text-xs text-stone-500 mt-0.5">{option.desc}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-stone-400 mt-2">
                        Default for {propertyType}: <span className="font-semibold capitalize">{defaultIntents[propertyType].replace("_", " ")}</span>
                    </p>
                </div>
            </div>

            {/* Location Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Location
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            City *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.city}
                            onChange={(e) => update("city", e.target.value)}
                            placeholder="e.g. Kathmandu"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            District *
                        </label>
                        <select
                            value={data.district}
                            onChange={(e) => update("district", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        >
                            <option value="">Select District</option>
                            {DISTRICTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={data.addressLine}
                            onChange={(e) => update("addressLine", e.target.value)}
                            placeholder="e.g. Thamel Marg"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Province
                        </label>
                        <input
                            type="text"
                            value={data.province}
                            onChange={(e) => update("province", e.target.value)}
                            placeholder="e.g. Bagmati"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
