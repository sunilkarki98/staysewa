import { useState, useEffect, useCallback } from "react";
import { UsersService } from "../services/domain";
import type { ApiError } from "../api/types";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
}

export function useUser() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await UsersService.getProfile();
            setProfile(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (data: { name?: string; phone?: string }) => {
        setUpdating(true);
        setError(null);
        try {
            const updated = await UsersService.updateProfile(data);
            setProfile(updated);
            return true;
        } catch (err) {
            setError(err as ApiError);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return { profile, loading, error, updating, updateProfile, refresh: fetchProfile };
}
