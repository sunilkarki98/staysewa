"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";

import type { StayCategory } from "@/types/stay";
import {
    StepProgress,
    PropertyTypeSelector,
    BasicDetailsForm,
    TypeSpecificForm,
    AmenitiesRulesForm,
    MediaUploadStep,
    ReviewSubmit,
} from "@/components/owner/listing-form";
import type {
    BasicDetailsData,
    TypeSpecificData,
    AmenitiesRulesData,
} from "@/components/owner/listing-form";
import { useStays } from "@/hooks/useStays";

const STEPS = ["Property Type", "Basic Details", "Specifics", "Amenities", "Photos", "Review"];

export default function AddListingPage() {
    const router = useRouter();
    const { createStay } = useStays();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ─── Form State ──────────────────────────────────────────
    const [propertyType, setPropertyType] = useState<StayCategory | null>(null);

    const [basicDetails, setBasicDetails] = useState<BasicDetailsData>({
        name: "",
        description: "",
        intent: "both",
        city: "",
        district: "",
        addressLine: "",
        province: "",
    });

    const [typeSpecific, setTypeSpecific] = useState<TypeSpecificData>({
        units: [],
        simple: { basePrice: 0, maxGuests: 2, bedrooms: 1, bathrooms: 1 },
    });

    const [amenitiesRules, setAmenitiesRules] = useState<AmenitiesRulesData>({
        amenities: [],
        rules: "",
        checkInTime: "14:00",
        checkOutTime: "11:00",
    });

    const [images, setImages] = useState<string[]>([]);

    // ─── Step Defaults on Type Selection ─────────────────────
    const handleTypeSelect = (type: StayCategory) => {
        setPropertyType(type);

        // Set default intent based on type
        const intentDefaults: Record<StayCategory, BasicDetailsData["intent"]> = {
            hotel: "short_stay",
            hostel: "short_stay",
            homestay: "both",
            apartment: "long_stay",
            room: "long_stay",
        };
        setBasicDetails((prev) => ({ ...prev, intent: intentDefaults[type] }));

        // Add a default unit for hotels/hostels
        if ((type === "hotel" || type === "hostel") && typeSpecific.units.length === 0) {
            setTypeSpecific((prev) => ({
                ...prev,
                units: [{
                    tempId: Math.random().toString(36).slice(2, 9),
                    name: "",
                    type: type === "hostel" ? "bed" : "private_room",
                    maxOccupancy: type === "hostel" ? 6 : 2,
                    basePrice: 0,
                    quantity: 1,
                    amenities: [],
                }],
            }));
        }
    };

    // ─── Validation ──────────────────────────────────────────
    const canProceed = (): boolean => {
        switch (currentStep) {
            case 0: return propertyType !== null;
            case 1: return basicDetails.name.trim() !== "" && basicDetails.city.trim() !== "" && basicDetails.district.trim() !== "";
            case 2: {
                if (propertyType === "hotel" || propertyType === "hostel") {
                    return typeSpecific.units.length > 0 && typeSpecific.units.every(u => u.name.trim() !== "" && u.basePrice > 0);
                }
                return typeSpecific.simple.basePrice > 0;
            }
            case 3: return true; // amenities and rules are optional
            case 4: return images.length > 0; // Photos required? Let's say yes, at least 1.
            case 5: return true;
            default: return false;
        }
    };

    // ─── Navigation ──────────────────────────────────────────
    const goNext = () => {
        if (currentStep < STEPS.length - 1 && canProceed()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // ─── Submit Handler ──────────────────────────────────────
    const handleSubmit = async () => {
        if (!propertyType) return;
        setIsSubmitting(true);

        try {
            const needsUnits = propertyType === "hotel" || propertyType === "hostel";
            const basePrice = needsUnits
                ? Math.min(...typeSpecific.units.map(u => u.basePrice))
                : typeSpecific.simple.basePrice;

            const payload = {
                name: basicDetails.name,
                type: propertyType,
                intent: basicDetails.intent,
                description: basicDetails.description,

                // Location (Discrete Fields)
                city: basicDetails.city,
                district: basicDetails.district,
                addressLine: basicDetails.addressLine,
                province: basicDetails.province || undefined,

                // Pricing (Convert to Paisa)
                basePrice: Math.round(basePrice * 100), // NPR -> Paisa

                // Details
                amenities: amenitiesRules.amenities,
                rules: amenitiesRules.rules.split("\n").filter(Boolean),
                checkInTime: amenitiesRules.checkInTime,
                checkOutTime: amenitiesRules.checkOutTime,

                // Conditional Fields
                maxGuests: needsUnits ? undefined : typeSpecific.simple.maxGuests,

                // Units (for Hotels/Hostels)
                stayUnits: needsUnits ? typeSpecific.units.map(u => ({
                    name: u.name,
                    type: u.type,
                    maxOccupancy: u.maxOccupancy,
                    basePrice: Math.round(u.basePrice * 100), // NPR -> Paisa
                    quantity: u.quantity,
                    amenities: u.amenities,
                })) : undefined,

                images: images,
            };

            await createStay(payload);

            setSubmitted(true);
        } catch (err) {
            console.error("Failed to create listing:", err);
            alert("Failed to create listing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Success Screen ──────────────────────────────────────
    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={40} weight="fill" className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                    Listing Submitted!
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md">
                    Your property &ldquo;{basicDetails.name}&rdquo; has been submitted for review.
                    You&apos;ll be notified once it&apos;s approved and live on StaySewa.
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/owner/listings"
                        className="px-6 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-sm"
                    >
                        View My Listings
                    </Link>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setCurrentStep(0);
                            setPropertyType(null);
                            setBasicDetails({ name: "", description: "", intent: "both", city: "", district: "", addressLine: "", province: "" });
                            setTypeSpecific({ units: [], simple: { basePrice: 0, maxGuests: 2, bedrooms: 1, bathrooms: 1 } });
                            setAmenitiesRules({ amenities: [], rules: "", checkInTime: "14:00", checkOutTime: "11:00" });
                            setImages([]);
                        }}
                        className="px-6 py-3 text-sm font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                        Add Another
                    </button>
                </div>
            </div>
        );
    }

    // ─── Render Current Step ─────────────────────────────────
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <PropertyTypeSelector
                        selected={propertyType}
                        onSelect={handleTypeSelect}
                    />
                );
            case 1:
                return (
                    <BasicDetailsForm
                        data={basicDetails}
                        propertyType={propertyType!}
                        onChange={setBasicDetails}
                    />
                );
            case 2:
                return (
                    <TypeSpecificForm
                        propertyType={propertyType!}
                        data={typeSpecific}
                        onChange={setTypeSpecific}
                    />
                );
            case 3:
                return (
                    <AmenitiesRulesForm
                        data={amenitiesRules}
                        onChange={setAmenitiesRules}
                    />
                );
            case 4:
                return (
                    <MediaUploadStep
                        images={images}
                        onChange={setImages}
                    />
                );
            case 5:
                return (
                    <ReviewSubmit
                        propertyType={propertyType!}
                        basicDetails={basicDetails}
                        typeSpecific={typeSpecific}
                        amenitiesRules={amenitiesRules}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/owner/listings"
                    className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} weight="bold" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Add New Listing
                    </h1>
                    <p className="text-stone-500 text-sm mt-0.5">
                        List your property on StaySewa
                    </p>
                </div>
            </div>

            {/* Step Progress */}
            <StepProgress currentStep={currentStep} steps={STEPS} />

            {/* Form Content */}
            <div className="min-h-[400px]">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < STEPS.length - 1 && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-200 dark:border-stone-800">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={goNext}
                        disabled={!canProceed()}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Step
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
