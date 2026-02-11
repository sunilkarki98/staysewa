"use client";

import { useState } from "react";
import { GoogleLogo, Phone, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { loginWithGoogle, loginWithPhone, verifyOtp } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (phoneNumber.length >= 10) {
            try {
                setLoading(true);
                setError("");
                await loginWithPhone(phoneNumber);
                setShowOtp(true);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length === 6) {
            try {
                setLoading(true);
                setError("");
                await verifyOtp(phoneNumber, otpValue);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
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
                            Welcome to StaySewa
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Sign in to book your perfect stay
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {!showOtp ? (
                        <>
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
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                <span className="text-sm text-gray-400 dark:text-gray-500">or</span>
                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Phone size={20} />
                                        <span className="text-sm font-medium">+977</span>
                                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="98XXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="w-full pl-28 pr-4 py-3.5 
                                            bg-gray-50 dark:bg-gray-800 
                                            border border-gray-200 dark:border-gray-700 
                                            rounded-xl text-gray-900 dark:text-white
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                            transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleSendOtp}
                                    disabled={phoneNumber.length < 10 || loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 
                                        bg-gradient-to-r from-blue-500 to-indigo-600 
                                        text-white font-semibold rounded-xl
                                        shadow-lg shadow-blue-500/30
                                        transition-all duration-200
                                        hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]
                                        active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                    {!loading && <ArrowRight size={18} weight="bold" />}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* OTP Verification */
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Enter the 6-digit code sent to
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    +977 {phoneNumber}
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !digit && index > 0) {
                                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                                prevInput?.focus();
                                            }
                                        }}
                                        className="w-12 h-14 text-center text-xl font-bold
                                            bg-gray-50 dark:bg-gray-800 
                                            border border-gray-200 dark:border-gray-700 
                                            rounded-xl text-gray-900 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                            transition-all"
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.some((d) => !d) || loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 
                                    bg-gradient-to-r from-blue-500 to-indigo-600 
                                    text-white font-semibold rounded-xl
                                    shadow-lg shadow-blue-500/30
                                    transition-all duration-200
                                    hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]
                                    active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? "Verifying..." : "Verify & Continue"}
                                {!loading && <ArrowRight size={18} weight="bold" />}
                            </button>

                            <div className="text-center">
                                <button
                                    onClick={() => setShowOtp(false)}
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
                                >
                                    ← Change phone number
                                </button>
                            </div>

                            <div className="text-center">
                                <button className="text-sm text-blue-500 hover:text-blue-600 font-medium transition">
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="text-blue-500 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-500 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Owner/Admin Links */}
                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Want to list your property?{" "}
                        <Link href="/owner" className="text-blue-500 hover:text-blue-600 font-medium">
                            Owner Portal →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
