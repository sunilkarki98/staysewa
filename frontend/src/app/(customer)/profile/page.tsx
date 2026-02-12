"use client";

import { useAuth } from "@/context/AuthContext";
import { User, EnvelopeSimple, Phone, IdentificationCard, FloppyDisk } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { UsersService } from "@/services/domain";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    // Local state for form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Sync form data with user once available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: "",
            });
        }
    }, [user]);

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>Please log in</div>;

    const handleSave = async () => {
        setSaving(true);
        setSaveError("");
        try {
            await UsersService.updateProfile({
                name: formData.name,
                phone: formData.phone,
            });
            setIsEditing(false);
        } catch (err: any) {
            setSaveError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-gray-950">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">

                    {/* Header with Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role} Account</p>
                        </div>
                    </div>

                    {/* Error message */}
                    {saveError && (
                        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                            {saveError}
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <IdentificationCard size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={isEditing ? formData.name : user.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <EnvelopeSimple size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl opacity-60 cursor-not-allowed text-gray-900 dark:text-white"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+977 98XXXXXXXX"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-orange-600 rounded-lg shadow-md shadow-orange-500/20 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FloppyDisk size={18} />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 text-sm font-medium text-white bg-stone-900 dark:bg-gray-700 hover:bg-stone-800 dark:hover:bg-gray-600 rounded-lg transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
