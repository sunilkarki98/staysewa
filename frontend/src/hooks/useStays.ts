import { useState, useEffect, useCallback } from "react";
import { StaysService } from "../services/domain";
import { Stay } from "../types/stay";
import { ApiError } from "../api/types";

export function useStays() {
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchStays = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await StaysService.getAll();
            setStays(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStays();
    }, [fetchStays]);

    const deleteStay = async (id: string) => {
        try {
            await StaysService.delete(id);
            // Optimistic update
            setStays((prev) => prev.filter((stay) => stay.id !== id));
            return true;
        } catch (err) {
            setError(err as ApiError);
            return false;
        }
    };

    return {
        stays,
        loading,
        error,
        refresh: fetchStays,
        deleteStay
    };
}
