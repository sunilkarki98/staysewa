"use client";

import { MagnifyingGlassIcon, EnvelopeSimpleIcon, PhoneIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import BookingDetailsDrawer from "@/components/owner/BookingDetailsDrawer";

// Mock Data for Bookings
const MOCK_BOOKINGS = [
    { id: "BK-7821", guest: "Sarah Jenkins", email: "sarah.j@email.com", phone: "+977-9841234567", property: "Sunny Hostel", checkIn: "2024-03-15", checkOut: "2024-03-20", status: "pending", amount: 4500 },
    { id: "BK-7822", guest: "Rajesh Kumar", email: "rajesh.k@email.com", phone: "+977-9812345678", property: "Modern Flat", checkIn: "2024-03-18", checkOut: "2024-04-18", status: "confirmed", amount: 45000 },
    { id: "BK-7823", guest: "Elena Rodriguez", email: "elena.r@email.com", phone: "+977-9867654321", property: "Cozy Homestay", checkIn: "2024-03-22", checkOut: "2024-03-25", status: "cancelled", amount: 7500 },
    { id: "BK-7824", guest: "Mike Chen", email: "mike.c@email.com", phone: "+977-9801112233", property: "Sunny Hostel", checkIn: "2024-04-01", checkOut: "2024-04-05", status: "pending", amount: 3600 },
    { id: "BK-7825", guest: "Priya Sharma", email: "priya.s@email.com", phone: "+977-9855443322", property: "Luxury Apt", checkIn: "2024-04-10", checkOut: "2024-04-15", status: "confirmed", amount: 22000 },
];

export default function BookingsPage() {
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [filter, setFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = (booking: typeof MOCK_BOOKINGS[0]) => {
        setSelectedBooking(booking);
        setIsDrawerOpen(true);
    };

    const handleAction = (id: string, action: "confirm" | "cancel") => {
        setBookings(prev => prev.map(booking => {
            if (booking.id === id) {
                return { ...booking, status: action === "confirm" ? "confirmed" : "cancelled" };
            }
            return booking;
        }));
    };

    const filteredBookings = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Bookings
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Manage incoming booking requests and reservations.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search guest or ID"
                            className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                        />
                    </div>
                    <div className="flex bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-1">
                        {["all", "pending", "confirmed", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${filter === status
                                    ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white"
                                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 text-xs uppercase tracking-wider text-stone-500 font-semibold">
                                <th className="px-5 py-4">Booking ID</th>
                                <th className="px-5 py-4">Guest</th>
                                <th className="px-5 py-4">Contact</th>
                                <th className="px-5 py-4">Property</th>
                                <th className="px-5 py-4">Dates</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                                    <td className="px-5 py-4 font-mono text-sm font-semibold text-stone-700 dark:text-stone-200">
                                        {booking.id}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {booking.guest.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-stone-900 dark:text-white text-sm">
                                                {booking.guest}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
                                                <EnvelopeSimpleIcon size={15} weight="bold" className="text-primary/70 flex-shrink-0" />
                                                <span className="font-medium">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
                                                <PhoneIcon size={15} weight="bold" className="text-primary/70 flex-shrink-0" />
                                                <span className="font-medium">{booking.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                                        {booking.property}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col text-sm text-stone-500">
                                            <span className="font-medium text-stone-700 dark:text-stone-300">{booking.checkIn}</span>
                                            <span className="text-xs">to {booking.checkOut}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-sm text-stone-900 dark:text-white">
                                        NPR {booking.amount.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${booking.status === 'confirmed' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" :
                                            booking.status === 'pending' ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30" :
                                                "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(booking.id, 'confirm')}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Confirm"
                                                    >
                                                        <CheckCircleIcon size={22} weight="fill" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(booking.id, 'cancel')}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircleIcon size={22} weight="fill" />
                                                    </button>
                                                </>
                                            )}
                                            {booking.status !== 'pending' && (
                                                <button
                                                    onClick={() => openDrawer(booking)}
                                                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-sm font-medium px-3 py-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
                                                >
                                                    Details
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                booking={selectedBooking}
                onAction={handleAction}
            />
        </div>
    );
}
