"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            // Supabase client handles the #access_token from the URL automatically
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Auth callback error:", error.message);
                router.push("/login?error=auth_callback_failed");
            } else if (session?.user) {
                // Check role and redirect
                const role = session.user.user_metadata?.role || session.user.app_metadata?.role || "guest";

                switch (role) {
                    case "owner":
                        router.push("/owner");
                        break;
                    case "admin":
                        router.push("/admin");
                        break;
                    case "customer":
                        router.push("/explore");
                        break;
                    default:
                        router.push("/explore");
                }
            } else {
                router.push("/login");
            }
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Finalizing sign-in...</h2>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we set up your session.</p>
            </div>
        </div>
    );
}
