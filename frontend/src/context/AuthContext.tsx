"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types/user";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { env } from "@/env";


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginWithGoogle: (role?: string) => Promise<void>;
    loginWithEmail: (email: string) => Promise<void>;
    loginWithPassword: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (!env.NEXT_PUBLIC_AUTH_REQUIRED) {
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
    const [isLoading, setIsLoading] = useState(() => env.NEXT_PUBLIC_AUTH_REQUIRED);
    const router = useRouter();

    useEffect(() => {
        // 0. Stop if Dev Mode (already handled in state init)
        if (!env.NEXT_PUBLIC_AUTH_REQUIRED) return;

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
                // Sync session to cookie for Middleware visibility
                document.cookie = `jwt=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata.full_name || "Guest",
                    role: session.user.user_metadata.role || "guest",
                    avatar: session.user.user_metadata.avatar_url,
                });
            } else {
                // Clear cookie on logout
                document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGoogle = async (role?: string) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: role ? {
                    role,
                    access_type: 'offline',
                    prompt: 'consent',
                } : undefined,
            },
        });
        if (error) throw error;
    };

    const loginWithEmail = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
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
                loginWithEmail,
                loginWithPassword: async (email, password) => {
                    const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (error) throw error;
                },
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
