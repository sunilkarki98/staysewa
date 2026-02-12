"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { House, Money, ShieldCheck, ArrowRight, CircleNotch } from "@phosphor-icons/react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { useAuth } from "@/context/AuthContext";

export default function BecomeHostPage() {
    const router = useRouter();
    const { loginWithGoogle } = useAuth(); // We can reuse Google login but need to ensure role is passed?
    // Supabase OAuth doesn't easily let us inject metadata on valid signup unless we use a flow that updates it post-signup.
    // For now, let's stick to Email/Password for explicit owner signup to ensure metadata is set.

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);

            // 1. Sign Up with Supabase
            // We inject role: 'owner' into user_metadata
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        // phone: formData.mobile, // COMMENTED OUT: Caused "Invalid API key" if SMS provider is not configured
                        role: 'owner', // CRITICAL: This sets the role
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // Success!
                // The middleware/auth context will pick up the role.
                // We might need to manually sign in if email confirmation is disabled, or wait for it.
                // Assuming email confirmation might be off for dev or we handle "Check email".

                // For this demo/principal implementation, we assume auto-signin or check email.
                // If auto-signin works (data.session exists), we rely on AuthContext to update.

                if (data.session) {
                    router.push("/owner");
                } else {
                    // Email confirmation required
                    alert("Registration successful! Please check your email to confirm your account.");
                    router.push("/owner-login");
                }
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-black pt-20 pb-20">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Value Prop */}
                    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white leading-tight mb-4">
                                Become a Host on <span className="text-primary">StaySewa</span>
                            </h1>
                            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-lg">
                                Join thousands of hosts renting their homes, rooms, and hostels. Earn extra income and connect with travelers.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                    <Money size={28} className="text-primary" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Earn Money</h3>
                                    <p className="text-stone-500 dark:text-stone-400">Turn your extra space into extra income. Safe and secure payouts.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={28} className="text-blue-600 dark:text-blue-400" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Secure Hosting</h3>
                                    <p className="text-stone-500 dark:text-stone-400">Verified guests and host protection programs included.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                    <House size={28} className="text-green-600 dark:text-green-400" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Full Control</h3>
                                    <p className="text-stone-500 dark:text-stone-400">You set the price, rules, and availability. We handle the rest.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 animate-in slide-in-from-right-4 duration-700 delay-100">
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
                            Create your Owner Account
                        </h2>

                        {error && (
                            <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    required
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

                            <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <CircleNotch size={24} className="animate-spin" /> : "Start Hosting Now"}
                                {!isLoading && <ArrowRight size={20} weight="bold" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                            Already have an owner account?{" "}
                            <Link href="/owner-login" className="text-primary font-semibold hover:underline">
                                Login here
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
