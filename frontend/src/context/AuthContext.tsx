"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types/user";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithPhone: (phone: string) => Promise<void>;
    verifyOtp: (phone: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'false') {
            return {
                id: "dev-user-123",
                email: "dev@staysewa.com",
                name: "Dev User",
                role: "owner",
                avatar: undefined,
            };
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(() => process.env.NEXT_PUBLIC_AUTH_REQUIRED !== 'false');
    const router = useRouter();

    useEffect(() => {
        // 0. Stop if Dev Mode (already handled in state init)
        if (process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'false') return;

        // 1. Check active session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Fetch full profile from backend to get role
                    // We can't import apiClient here easily because of circular deps potentially?
                    // actually apiClient imports supabase, so it might be cyclic if we are not careful.
                    // Let's use fetch directly or ensure no cycle.
                    // User metadata is also a good fallback.

                    const role = session.user.user_metadata?.role || session.user.app_metadata?.role || "guest";

                    setUser({
                        id: session.user.id,
                        email: session.user.email || "",
                        name: session.user.user_metadata.full_name || "Guest",
                        role: role,
                        avatar: session.user.user_metadata.avatar_url,
                    });
                }
            } catch (err) {
                console.error("Session check failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata.full_name || "Guest",
                    role: session.user.user_metadata.role || "guest",
                    avatar: session.user.user_metadata.avatar_url,
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    };

    const loginWithPhone = async (phone: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            phone: `+977${phone}`, // Assuming Nepal for now based on context
        });
        if (error) throw error;
    };

    const verifyOtp = async (phone: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            phone: `+977${phone}`,
            token,
            type: 'sms',
        });
        if (error) throw error;
        router.push("/");
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                loginWithGoogle,
                loginWithPhone,
                verifyOtp,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
