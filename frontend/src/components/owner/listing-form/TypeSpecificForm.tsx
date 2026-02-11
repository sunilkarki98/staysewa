"use client";

import { PlusCircle, TrashSimple } from "@phosphor-icons/react";
import type { StayCategory, UnitType } from "@/types/stay";

// ─── Unit builder data ──────────────────────────────────────
export interface UnitData {
    tempId: string; // client-side ID for key
    name: string;
    type: UnitType;
    maxOccupancy: number;
    basePrice: number;
    quantity: number;
    amenities: string[];
}

// ─── Simple property data (homestay/apartment/room) ─────────
export interface SimplePropertyData {
    basePrice: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
}

export interface TypeSpecificData {
    units: UnitData[];
    simple: SimplePropertyData;
}

interface TypeSpecificFormProps {
    propertyType: StayCategory;
    data: TypeSpecificData;
    onChange: (data: TypeSpecificData) => void;
}

const UNIT_TYPES: Record<string, { label: string; types: { value: UnitType; label: string }[] }> = {
    hotel: {
        label: "Room",
        types: [
            { value: "private_room", label: "Private Room" },
            { value: "entire_place", label: "Suite / Entire Floor" },
        ],
    },
    hostel: {
        label: "Accommodation",
        types: [
            { value: "bed", label: "Bed (Dormitory)" },
            { value: "shared_room", label: "Shared Room" },
            { value: "private_room", label: "Private Room" },
        ],
    },
};

const UNIT_AMENITIES = [
    "Attached Bathroom", "Hot Water", "AC", "Heater", "TV",
    "WiFi", "Balcony", "Mountain View", "Wardrobe", "Desk",
];

function generateTempId() {
    return Math.random().toString(36).slice(2, 9);
}

export default function TypeSpecificForm({ propertyType, data, onChange }: TypeSpecificFormProps) {
    const needsUnits = propertyType === "hotel" || propertyType === "hostel";

    // ─── Unit Builders (Hotel / Hostel) ──────────────────────
    const addUnit = () => {
        const unitConfig = UNIT_TYPES[propertyType];
        const newUnit: UnitData = {
            tempId: generateTempId(),
            name: "",
            type: unitConfig?.types[0]?.value || "private_room",
            maxOccupancy: propertyType === "hostel" ? 6 : 2,
            basePrice: 0,
            quantity: 1,
            amenities: [],
        };
        onChange({ ...data, units: [...data.units, newUnit] });
    };

    const updateUnit = (index: number, field: keyof UnitData, value: unknown) => {
        const updated = [...data.units];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, units: updated });
    };

    const removeUnit = (index: number) => {
        onChange({ ...data, units: data.units.filter((_, i) => i !== index) });
    };

    const toggleUnitAmenity = (index: number, amenity: string) => {
        const unit = data.units[index];
        const has = unit.amenities.includes(amenity);
        updateUnit(index, "amenities", has
            ? unit.amenities.filter((a) => a !== amenity)
            : [...unit.amenities, amenity]
        );
    };

    // ─── Simple property updater ─────────────────────────────
    const updateSimple = (field: keyof SimplePropertyData, value: number) => {
        onChange({ ...data, simple: { ...data.simple, [field]: value } });
    };

    if (needsUnits) {
        const unitConfig = UNIT_TYPES[propertyType];

        return (
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Set up your {unitConfig.label.toLowerCase()}s
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-2">
                        Add each type of {unitConfig.label.toLowerCase()} you offer with its pricing and capacity.
                    </p>
                </div>

                {/* Existing Units */}
                {data.units.map((unit, index) => (
                    <div
                        key={unit.tempId}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 relative"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-stone-900 dark:text-white">
                                {unitConfig.label} {index + 1}
                            </h4>
                            {data.units.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeUnit(index)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <TrashSimple size={18} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    {unitConfig.label} Name *
                                </label>
                                <input
                                    type="text"
                                    value={unit.name}
                                    onChange={(e) => updateUnit(index, "name", e.target.value)}
                                    placeholder={propertyType === "hostel" ? "e.g. 6-Bed Dorm" : "e.g. Deluxe Double"}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    Type *
                                </label>
                                <select
                                    value={unit.type}
                                    onChange={(e) => updateUnit(index, "type", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                >
                                    {unitConfig.types.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    Price (NPR) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={unit.basePrice || ""}
                                    onChange={(e) => updateUnit(index, "basePrice", Number(e.target.value))}
                                    placeholder="e.g. 1500"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>

                            {/* Occupancy */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    Max Occupancy
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={unit.maxOccupancy}
                                    onChange={(e) => updateUnit(index, "maxOccupancy", Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={unit.quantity}
                                    onChange={(e) => updateUnit(index, "quantity", Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>
                        </div>

                        {/* Unit Amenities */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                                {unitConfig.label} Amenities
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {UNIT_AMENITIES.map((amenity) => {
                                    const selected = unit.amenities.includes(amenity);
                                    return (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => toggleUnitAmenity(index, amenity)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"
                                                }`}
                                        >
                                            {amenity}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Unit Button */}
                <button
                    type="button"
                    onClick={addUnit}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-stone-500 hover:text-primary hover:border-primary/50 transition-colors font-semibold"
                >
                    <PlusCircle size={22} weight="bold" />
                    Add {unitConfig.label}
                </button>
            </div>
        );
    }

    // ─── Simple form (homestay / apartment / room) ───────────
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                    Property Details
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    Set pricing and capacity for your {propertyType}.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Pricing & Capacity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Base Price (NPR) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.simple.basePrice || ""}
                            onChange={(e) => updateSimple("basePrice", Number(e.target.value))}
                            placeholder={propertyType === "apartment" ? "e.g. 25000" : "e.g. 2500"}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                        <p className="text-xs text-stone-400 mt-1">
                            {propertyType === "apartment" ? "Monthly rent in NPR" : "Per night in NPR"}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Max Guests *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={data.simple.maxGuests}
                            onChange={(e) => updateSimple("maxGuests", Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Bedrooms
                        </label>
                        <select
                            value={data.simple.bedrooms}
                            onChange={(e) => updateSimple("bedrooms", Number(e.target.value))}
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
                            value={data.simple.bathrooms}
                            onChange={(e) => updateSimple("bathrooms", Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        >
                            {[1, 2, 3, 4].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
