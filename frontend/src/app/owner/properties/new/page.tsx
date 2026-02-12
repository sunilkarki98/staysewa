"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";

import type { PropertyCategory } from "@/types/property";
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
import { useProperties } from "@/hooks/useProperties";

const STEPS = ["Property Type", "Basic Details", "Specifics", "Amenities", "Photos", "Review"];

export default function AddPropertyPage() {
    const router = useRouter();
    const { createProperty } = useProperties();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ─── Form State ──────────────────────────────────────────
    const [propertyType, setPropertyType] = useState<PropertyCategory | null>(null);

    const [basicDetails, setBasicDetails] = useState<BasicDetailsData>({
        name: "",
        description: "",
        city: "",
        district: "",
        address_line: "",
        province: "",
    });

    const [typeSpecific, setTypeSpecific] = useState<TypeSpecificData>({
        units: [],
        simple: { base_price: 0, max_guests: 2, bedrooms: 1, bathrooms: 1, details: "" },
    });

    const [amenitiesRules, setAmenitiesRules] = useState<AmenitiesRulesData>({
        amenities: [],
        rules: "",
        check_in_time: "14:00",
        check_out_time: "11:00",
    });

    const [images, setImages] = useState<string[]>([]);

    // ─── Step Defaults on Type Selection ─────────────────────
    const handleTypeSelect = (type: PropertyCategory) => {
        setPropertyType(type);

        const isUnitBased = ["hotel", "resort", "hostel"].includes(type);

        if (isUnitBased && typeSpecific.units.length === 0) {
            setTypeSpecific((prev) => ({
                ...prev,
                units: [{
                    tempId: Math.random().toString(36).slice(2, 9),
                    name: "",
                    type: type === "hostel" ? "bed" : "private_room",
                    max_occupancy: type === "hostel" ? 6 : 2,
                    base_price: 0,
                    quantity: 1,
                    amenities: [],
                    details: "",
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
                if (["hotel", "resort", "hostel"].includes(propertyType as string)) {
                    return typeSpecific.units.length > 0 && typeSpecific.units.every(u => u.name.trim() !== "" && u.base_price > 0);
                }
                return typeSpecific.simple.base_price > 0;
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

            const needsUnits = ["hotel", "resort", "hostel"].includes(propertyType);
            const basePrice = needsUnits
                ? Math.min(...typeSpecific.units.map(u => u.base_price))
                : typeSpecific.simple.base_price;

            const payload = {
                name: basicDetails.name,
                type: propertyType,
                // Description (Clean)
                description: basicDetails.description,

                // Location (Discrete Fields)
                city: basicDetails.city,
                district: basicDetails.district,
                address_line: basicDetails.address_line,
                province: basicDetails.province || undefined,

                // Pricing (Convert to Paisa)
                base_price: Math.round(basePrice * 100), // NPR -> Paisa

                // Details (Merge standard amenities + custom details)
                amenities: [
                    ...amenitiesRules.amenities,
                    ...(!needsUnits && typeSpecific.simple.details
                        ? typeSpecific.simple.details.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                        : [])
                ],
                rules: amenitiesRules.rules.split("\n").filter(Boolean),
                check_in_time: amenitiesRules.check_in_time,
                check_out_time: amenitiesRules.check_out_time,

                // Conditional Fields
                max_guests: needsUnits ? undefined : typeSpecific.simple.max_guests,
                bedrooms: needsUnits ? undefined : typeSpecific.simple.bedrooms,
                bathrooms: needsUnits ? undefined : typeSpecific.simple.bathrooms,

                // Units (for Hotels/Hostels)
                units: needsUnits ? typeSpecific.units.map(u => ({
                    name: u.name,
                    type: u.type,
                    max_occupancy: u.max_occupancy,
                    base_price: Math.round(u.base_price * 100), // NPR -> Paisa
                    quantity: u.quantity,
                    // Merge existing amenities with details tags
                    amenities: [
                        ...u.amenities,
                        ...(u.details ? u.details.split(/[,\n]/).map(s => s.trim()).filter(Boolean) : [])
                    ],
                })) as any : undefined,

                images: images,
            };

            await createProperty(payload as any);

            setSubmitted(true);
        } catch (err) {
            console.error("Failed to create property:", err);
            alert("Failed to create property. Please try again.");
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
                    Property Submitted!
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md">
                    Your property &ldquo;{basicDetails.name}&rdquo; has been submitted for review.
                    You&apos;ll be notified once it&apos;s approved and live on StaySewa.
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/owner/properties"
                        className="px-6 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition shadow-sm"
                    >
                        View My Properties
                    </Link>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setCurrentStep(0);
                            setPropertyType(null);
                            setBasicDetails({ name: "", description: "", city: "", district: "", address_line: "", province: "" });
                            setTypeSpecific({ units: [], simple: { base_price: 0, max_guests: 2, bedrooms: 1, bathrooms: 1, details: "" } });
                            setAmenitiesRules({ amenities: [], rules: "", check_in_time: "14:00", check_out_time: "11:00" });
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
                    href="/owner/properties"
                    className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} weight="bold" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Add New Property
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
