import { useState, useEffect } from "react";
import { StatsService } from "../services/domain";
import { ApiError } from "../api/types";

export function useStats() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await StatsService.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError(err as ApiError);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}
