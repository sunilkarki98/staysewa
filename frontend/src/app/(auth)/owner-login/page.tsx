"use client";

import { useState } from "react";
import { ArrowLeft, CircleNotch } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OwnerLoginPage() {
    const { loginWithPassword } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return;

        try {
            setLoading(true);
            setError("");
            await loginWithPassword(formData.email, formData.password);

            // Redirect will be handled by auth state change or manual push if needed
            // But auth.middleware usually handles role redirects.
            // Let's force push to /owner to be safe or let global listener handle it
            router.push("/owner");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Invalid login credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-black px-4">
            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white mb-8 transition">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                            S
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                            Owner Portal
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-2">
                            Manage your properties and bookings
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="owner@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <CircleNotch size={24} className="animate-spin" /> : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            Don't have an account?{" "}
                            <Link href="/become-host" className="text-primary font-semibold hover:underline">
                                Start Hosting
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
