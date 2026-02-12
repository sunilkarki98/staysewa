"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Use AuthContext to get user
import { apiClient } from "@/api/client"; // Use apiClient for requests
import { Buildings, MapPin, IdentificationBadge, ArrowRight, CircleNotch } from "@phosphor-icons/react";
import Container from "@/components/layout/Container";

export default function OwnerOnboardingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        businessName: "",
        address: "",
        mobile: "", // Added
        panNumber: "",
        nationality: "Nepali",
        idType: "citizenship", // Added
        idNumber: "", // Added
        agreedToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.agreedToTerms) {
            setError("You must agree to the Terms and Conditions to proceed.");
            return;
        }

        try {
            setIsLoading(true);

            // Call the backend endpoint created earlier
            await apiClient.patch("/owners/profile", {
                businessName: formData.businessName,
                address: formData.address,
                phone: formData.mobile, // Map to phone
                panNumber: formData.panNumber,
                nationality: formData.nationality,
                idType: formData.idType,
                idNumber: formData.idNumber,
                // We set verificationStatus to 'pending' implicitly in backend if not already
                // Or we can explicitly request verification? Backend defaults to pending.
            });

            // Redirect to dashboard on success
            router.push("/owner");

        } catch (err: any) {
            console.error("Onboarding failed:", err);
            setError(err.response?.data?.message || err.message || "Failed to save profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-black pt-20 pb-20">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
                            Welcome, {user?.name || "Host"}!
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400">
                            Let's set up your host profile so you can start listing properties.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800">
                        {error && (
                            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/50">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Business Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                                    <Buildings size={20} className="text-primary" />
                                    Business Details <span className="text-stone-400 font-normal text-sm ml-auto">(Optional)</span>
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Business / Brand Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Pokhara Homestays Pvt Ltd"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">PAN / VAT Number</label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        value={formData.panNumber}
                                        onChange={handleChange}
                                        placeholder="XXXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="98XXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="border-stone-100 dark:border-stone-800" />

                            {/* Address */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                                    <MapPin size={20} className="text-primary" />
                                    Address
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street, City, District"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    />
                                </div>
                            </div>

                            <hr className="border-stone-100 dark:border-stone-800" />

                            {/* Identification */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                                    <IdentificationBadge size={20} className="text-primary" />
                                    Identification
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">ID Type</label>
                                        <select
                                            name="idType"
                                            value={formData.idType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none"
                                        >
                                            <option value="citizenship">Citizenship</option>
                                            <option value="national_id_card">National ID Card</option>
                                            <option value="passport">Passport</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">ID Number</label>
                                        <input
                                            type="text"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleChange}
                                            placeholder="ID Number"
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Placeholder for ID Photos - To be implemented with file upload */}
                                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                                    <p className="font-medium text-stone-900 dark:text-white mb-2">ID Photo Upload</p>
                                    <div className="flex gap-4">
                                        <button type="button" className="flex-1 py-8 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-stone-500 hover:border-primary hover:text-primary transition flex flex-col items-center gap-2">
                                            <IdentificationBadge size={32} />
                                            <span>Front Side</span>
                                        </button>
                                        <button type="button" className="flex-1 py-8 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-stone-500 hover:border-primary hover:text-primary transition flex flex-col items-center gap-2">
                                            <IdentificationBadge size={32} />
                                            <span>Back Side</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-2">
                                        * Note: Actual file upload will be enabled in the settings page for now. Please ensure your details match your ID.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="agreedToTerms"
                                            checked={formData.agreedToTerms}
                                            onChange={handleCheckboxChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-6 h-6 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                        <svg className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition">
                                        I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Host Standards</a>.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <CircleNotch size={24} className="animate-spin" /> : "Complete Setup"}
                                {!isLoading && <ArrowRight size={20} weight="bold" />}
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
