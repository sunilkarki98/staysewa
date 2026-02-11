"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookingsService } from "@/services/domain";
import { Booking } from "@/types/booking";
import Link from "next/link";
import { CalendarCheck, MapPin, Ticket } from "@phosphor-icons/react";

export default function MyBookingsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchBookings();
        }
    }, [authLoading, user]);

    const fetchBookings = async () => {
        try {
            const data = await BookingsService.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Manage your upcoming and past stays.
                </p>

                {bookings.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 dark:bg-gray-800 rounded-full mb-4 text-stone-400">
                            <Ticket size={32} weight="duotone" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No bookings yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            You haven&apos;t made any bookings yet. Explore our stays and find your next adventure!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-primary rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                        >
                            Explore Stays
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                            >
                                {/* Date Box */}
                                <div className="flex-shrink-0 flex flex-row md:flex-col items-center justify-center md:w-24 bg-stone-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-stone-100 dark:border-gray-700">
                                    <CalendarCheck size={24} className="text-primary mb-1 hidden md:block" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Check In</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{booking.checkIn}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {booking.property}
                                        </h3>
                                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full capitalize w-fit
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                booking.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        <MapPin size={16} weight="fill" />
                                        <span>Kathmandu, Nepal</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-500">
                                            Total: <span className="text-gray-900 dark:text-white">NPR {booking.amount.toLocaleString()}</span>
                                        </p>
                                        <Link
                                            href={`/stays/${booking.id}`} // Assuming stay ID is implicit or we link to booking details
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            View Property
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
