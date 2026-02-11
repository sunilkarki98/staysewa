"use client";

import { User, Shield, Bell } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { UsersService } from "@/services/domain";

export default function SettingsPage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState("");

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setSaveError("");
        try {
            await UsersService.updateProfile({ name, phone });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setSaveError(err.message || "Failed to save changes");
            setTimeout(() => setSaveError(""), 5000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Manage your account details and preferences.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Profile Section */}
                <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                    <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
                        <User size={20} className="text-primary" />
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+977 98XXXXXXXX"
                                className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Role</label>
                            <input
                                type="text"
                                value={user?.role || "customer"}
                                disabled
                                className="w-full px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Password / Security */}
                <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                    <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
                        <Shield size={20} className="text-primary" />
                        Security
                    </h2>
                    <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl">
                        <div>
                            <p className="font-medium text-stone-900 dark:text-white">Password</p>
                            <p className="text-xs text-stone-500">Managed by Supabase Auth</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
                        <Bell size={20} className="text-primary" />
                        Notifications
                    </h2>
                    <div className="space-y-3">
                        {['New Booking Request', 'Booking Confirmed', 'New Review', 'Payment Received'].map((item) => (
                            <div key={item} className="flex items-center justify-between">
                                <span className="text-sm text-stone-700 dark:text-stone-300">{item}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-stone-50 dark:bg-stone-800/30 flex justify-end gap-3 border-t border-stone-100 dark:border-stone-800">
                    {saved && (
                        <span className="text-sm text-green-600 self-center mr-auto font-medium">
                            ✓ Changes saved successfully
                        </span>
                    )}
                    <button className="px-6 py-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-white/50 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
