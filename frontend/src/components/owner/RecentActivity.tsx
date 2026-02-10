"use client";

import { Clock, CheckCircle, XCircle } from "@phosphor-icons/react";

const ACTIVITIES = [
    {
        id: 1,
        type: "booking",
        message: "New booking request from Sarah for 'Sunny Hostel'",
        time: "10 min ago",
        status: "pending",
    },
    {
        id: 2,
        type: "payment",
        message: "Payment received for Booking #4821",
        time: "2 hours ago",
        status: "completed",
    },
    {
        id: 3,
        type: "review",
        message: "New 5-star review on 'Cozy Homestay'",
        time: "5 hours ago",
        status: "completed",
    },
    {
        id: 4,
        type: "system",
        message: "Listing 'Modern Flat' approved by admin",
        time: "1 day ago",
        status: "completed",
    },
];

export default function RecentActivity() {
    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">Recent Activity</h3>
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View All
                </button>
            </div>

            <div className="p-0">
                {ACTIVITIES.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`flex gap-4 p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer ${index !== ACTIVITIES.length - 1 ? "border-b border-stone-100 dark:border-stone-800" : ""
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
                ))}
            </div>
        </div>
    );
}
