"use client";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-black">
            <div className="mx-auto max-w-md text-center">
                {/* 404 */}
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    404 error
                </p>

                <h1 className="mt-4 text-4xl font-bold text-black dark:text-white">
                    Page not found
                </h1>

                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90"
                    >
                        <ArrowLeft size={18} />
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
