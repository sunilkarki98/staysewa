"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import { PaymentsService } from "@/services/domain";

function PaymentVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pidx = searchParams.get("pidx");

    const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        if (!pidx) {
            setStatus("failed");
            setMessage("Invalid payment parameters.");
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await PaymentsService.verify(pidx);
                if (response.status === "Completed" || response.status === "success" || (response as any).success) {
                    setStatus("success");
                    setMessage("Payment successful! Your booking is confirmed.");
                } else {
                    setStatus("failed");
                    setMessage("Payment verification failed. Please contact support.");
                }
            } catch (err) {
                console.error(err);
                setStatus("failed");
                setMessage("An error occurred while verifying payment.");
            }
        };

        verifyPayment();
    }, [pidx]);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">

                {status === "verifying" && (
                    <div className="flex flex-col items-center py-8">
                        <Spinner size={48} className="text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying Payment</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we confirm your transaction...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                            <CheckCircle size={32} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <Link
                                href="/my-bookings"
                                className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                            >
                                View My Bookings
                            </Link>
                            <Link
                                href="/"
                                className="w-full py-3 px-4 bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-gray-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-gray-700 transition"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                )}

                {status === "failed" && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                            <XCircle size={32} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => router.back()}
                                className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/contact"
                                className="w-full py-3 px-4 bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-gray-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-gray-700 transition"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function PaymentVerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col items-center py-8">
                        <Spinner size={48} className="text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loading...</h2>
                    </div>
                </div>
            </div>
        }>
            <PaymentVerifyContent />
        </Suspense>
    );
}
