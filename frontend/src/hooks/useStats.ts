import { useState, useEffect, useCallback } from "react";
import { StatsService } from "../services/domain";
import type { DashboardStat, Activity } from "../services/domain";
import type { ApiError } from "../api/types";

export function useStats() {
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await StatsService.getDashboardStats();
            setStats(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
}

export function useRecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = useCallback(async () => {
        setLoading(true);
        try {
            const data = await StatsService.getRecentActivity();
            setActivities(data);
        } catch {
            // Fail silently — empty state shown
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    return { activities, loading, refresh: fetchActivity };
}
