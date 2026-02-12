import { X, MapPin, CurrencyInr, CheckCircle } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { Property, PROPERTY_TYPE_LABELS } from "../../types/property";

type EditListingDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    listing: Property | null;
    onSave: (updatedListing: Property) => void;
};

export default function EditListingDrawer({ isOpen, onClose, listing, onSave }: EditListingDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState<Property | null>(null);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (listing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(listing);
        }
    }, [listing]);

    const handleChange = (field: keyof Property, value: any) => {
        if (!formData) return;
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
            onClose();
        }
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl h-full overflow-y-auto transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 px-6 py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                            Edit Property
                        </h2>
                        <span className="text-xs font-mono text-stone-500">
                            ID: {listing?.id}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {formData && (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Property Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                Category
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            >
                                {Object.entries(PROPERTY_TYPE_LABELS).map(([val, lab]) => (
                                    <option key={val} value={val}>{lab}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-2">
                                    <MapPin size={16} />
                                    City
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                                    District
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.district}
                                    onChange={(e) => handleChange("district", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-2">
                                <CurrencyInr size={16} />
                                Base Price (NPR)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.base_price / 100}
                                onChange={(e) => handleChange("base_price", Number(e.target.value) * 100)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl font-semibold text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 text-white bg-primary hover:bg-primary/90 rounded-xl font-semibold text-sm transition shadow-sm shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} weight="fill" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
