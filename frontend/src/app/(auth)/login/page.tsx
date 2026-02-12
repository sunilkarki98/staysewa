"use client";

import { useState } from "react";
import { GoogleLogo, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError("");
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            setError("");
            await loginWithEmail(email);
            setIsMagicLinkSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 p-8">

                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                            <span className="text-2xl font-bold text-white">S</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Sign in to your StaySewa account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    {isMagicLinkSent ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full">
                                <ArrowRight size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Check your email</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    We sent a magic link to <span className="font-medium text-gray-900 dark:text-white">{email}</span>.
                                    Click the link to sign in instantly.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsMagicLinkSent(false)}
                                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition"
                            >
                                ← Try another email
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 
                                    bg-white dark:bg-gray-800 
                                    border border-gray-200 dark:border-gray-700 
                                    rounded-xl text-gray-700 dark:text-gray-200 
                                    font-medium transition-all duration-200
                                    hover:bg-gray-50 dark:hover:bg-gray-750 
                                    hover:border-gray-300 dark:hover:border-gray-600
                                    hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                <GoogleLogo size={22} weight="bold" className="text-red-500" />
                                {loading ? "Connecting..." : "Continue with Google"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">or</span>
                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* Email Input Flow */}
                            <form onSubmit={handleEmailSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3.5 
                                            bg-gray-50 dark:bg-gray-800 
                                            border border-gray-200 dark:border-gray-700 
                                            rounded-xl text-gray-900 dark:text-white
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                            transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!email || loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 
                                        bg-gradient-to-r from-blue-500 to-indigo-600 
                                        text-white font-semibold rounded-xl
                                        shadow-lg shadow-blue-500/30
                                        transition-all duration-200
                                        hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.01]
                                        active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? "Sending link..." : "Continue with Email"}
                                    {!loading && <ArrowRight size={18} weight="bold" />}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Owner/Admin Links - REMOVED for separation */}
                {/* <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interested in hosting?{" "}
                        <Link href="/become-host" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                            Owner Portal →
                        </Link>
                    </p>
                </div> */}
            </div>
        </div>
    );
}
