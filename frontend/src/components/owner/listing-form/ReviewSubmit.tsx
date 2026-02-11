"use client";

import { CheckCircle, MapPin, Clock } from "@phosphor-icons/react";
import type { StayCategory } from "@/types/stay";
import { STAY_TYPE_LABELS, STAY_INTENT_LABELS } from "@/types/stay";
import type { BasicDetailsData } from "./BasicDetailsForm";
import type { TypeSpecificData } from "./TypeSpecificForm";
import type { AmenitiesRulesData } from "./AmenitiesRulesForm";

interface ReviewSubmitProps {
    propertyType: StayCategory;
    basicDetails: BasicDetailsData;
    typeSpecific: TypeSpecificData;
    amenitiesRules: AmenitiesRulesData;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export default function ReviewSubmit({
    propertyType,
    basicDetails,
    typeSpecific,
    amenitiesRules,
    isSubmitting,
    onSubmit,
}: ReviewSubmitProps) {
    const needsUnits = propertyType === "hotel" || propertyType === "hostel";

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                    Review Your Listing
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    Make sure everything looks good before submitting.
                </p>
            </div>

            {/* Property Overview */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                        {basicDetails.name || "Untitled Property"}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {STAY_TYPE_LABELS[propertyType]}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {[basicDetails.city, basicDetails.district].filter(Boolean).join(", ") || "No location set"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {STAY_INTENT_LABELS[basicDetails.intent]}
                    </span>
                </div>

                {basicDetails.description && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3">
                        {basicDetails.description.slice(0, 200)}
                        {basicDetails.description.length > 200 && "..."}
                    </p>
                )}
            </div>

            {/* Pricing & Units */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {needsUnits ? "Rooms & Pricing" : "Pricing & Capacity"}
                </h3>

                {needsUnits ? (
                    <div className="space-y-3">
                        {typeSpecific.units.length === 0 && (
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                ⚠ No rooms/units added yet. Please go back and add at least one.
                            </p>
                        )}
                        {typeSpecific.units.map((unit, i) => (
                            <div
                                key={unit.tempId}
                                className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-xl"
                            >
                                <div>
                                    <span className="font-semibold text-stone-900 dark:text-white">
                                        {unit.name || `Unit ${i + 1}`}
                                    </span>
                                    <span className="ml-2 text-xs text-stone-400 capitalize">
                                        {unit.type.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-primary">
                                        NPR {unit.basePrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-stone-400 ml-1">
                                        × {unit.quantity} · Max {unit.maxOccupancy}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <InfoCard label="Base Price" value={`NPR ${typeSpecific.simple.basePrice.toLocaleString()}`} />
                        <InfoCard label="Max Guests" value={String(typeSpecific.simple.maxGuests)} />
                        <InfoCard label="Bedrooms" value={String(typeSpecific.simple.bedrooms)} />
                        <InfoCard label="Bathrooms" value={String(typeSpecific.simple.bathrooms)} />
                    </div>
                )}
            </div>

            {/* Amenities */}
            {amenitiesRules.amenities.length > 0 && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                        Amenities ({amenitiesRules.amenities.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {amenitiesRules.amenities.map((a) => (
                            <span key={a} className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-sm text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                                <CheckCircle size={14} weight="fill" className="text-green-500" />
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Rules + Times */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Check-in & Rules
                </h3>
                <div className="flex gap-6 text-sm text-stone-600 dark:text-stone-400">
                    <span>Check-in: <strong className="text-stone-900 dark:text-white">{amenitiesRules.checkInTime || "14:00"}</strong></span>
                    <span>Check-out: <strong className="text-stone-900 dark:text-white">{amenitiesRules.checkOutTime || "11:00"}</strong></span>
                </div>
                {amenitiesRules.rules && (
                    <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
                        <ul className="space-y-1">
                            {amenitiesRules.rules.split("\n").filter(Boolean).map((rule, i) => (
                                <li key={i} className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2">
                                    <span className="text-stone-300 mt-0.5">•</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="pt-4 pb-8">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} weight="bold" />
                            Submit Listing for Review
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-stone-400 mt-3">
                    Your listing will be reviewed before going live on StaySewa.
                </p>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3 text-center">
            <p className="text-xs text-stone-400 font-medium">{label}</p>
            <p className="text-lg font-bold text-stone-900 dark:text-white mt-0.5">{value}</p>
        </div>
    );
}
