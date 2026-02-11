"use client";

import { Clock } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { StatsService } from "@/services/domain";

interface Activity {
    id: string | number;
    type: string;
    message: string;
    time: string;
    status: string;
}

export default function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await StatsService.getRecentActivity();
                setActivities(data);
            } catch {
                // Fail silently, show empty state
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="p-5 space-y-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="mt-1 h-2 w-2 rounded-full bg-stone-200 dark:bg-stone-700 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-3/4" />
                                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">Recent Activity</h3>
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View All
                </button>
            </div>

            <div className="p-0">
                {activities.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-stone-400">No recent activity yet.</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className={`flex gap-4 p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${index !== activities.length - 1 ? "border-b border-stone-100 dark:border-stone-800" : ""
                                }`}
                        >
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${activity.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                                }`} />

                            <div className="flex-1">
                                <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-snug">
                                    {activity.message}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-stone-400">
                                    <Clock size={12} />
                                    <span>{activity.time}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
