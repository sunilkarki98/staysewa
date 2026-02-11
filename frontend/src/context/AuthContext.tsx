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
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Map Supabase user to our User type
                // In a real app, you might fetch additional profile data from your backend here
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata.full_name || "Guest",
                    role: "guest", // Default, or fetch from DB/Metadata
                    avatar: session.user.user_metadata.avatar_url,
                });

                // Set token for API calls if needed (though we use Supabase client mostly, 
                // but for backend calls we might need the JWT)
                // apiClient.setToken(session.access_token); 
                // (Assuming apiClient handles it or we pass it in headers)
            }
            setIsLoading(false);
        };

        checkSession();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata.full_name || "Guest",
                    role: "guest",
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
