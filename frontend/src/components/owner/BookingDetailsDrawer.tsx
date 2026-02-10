import { XIcon, UserIcon, CalendarBlankIcon, MapPinIcon, ReceiptIcon, CheckCircleIcon, XCircleIcon, EnvelopeSimpleIcon, PhoneIcon, ClockIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

// Using the same type structure as MOCK_BOOKINGS in page.tsx for consistency
// In a real app, this would be imported from a shared types file
type Booking = {
    id: string;
    guest: string;
    email: string;
    phone: string;
    property: string;
    checkIn: string;
    checkOut: string;
    status: string;
    amount: number;
};

type BookingDetailsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onAction: (id: string, action: "confirm" | "cancel") => void;
};

export default function BookingDetailsDrawer({ isOpen, onClose, booking, onAction }: BookingDetailsDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for transition
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    if (!booking) return null;

    // Calculate duration (mock logic)
    const startDate = new Date(booking.checkIn);
    const endDate = new Date(booking.checkOut);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl h-full overflow-y-auto transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 px-6 py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                            Booking Details
                        </h2>
                        <span className="text-xs font-mono text-stone-500">
                            ID: {booking.id}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl flex items-center gap-3 border ${booking.status === 'confirmed' ? "bg-green-50 border-green-100 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300" :
                        booking.status === 'pending' ? "bg-orange-50 border-orange-100 text-orange-800 dark:bg-orange-900/20 dark:border-orange-900/30 dark:text-orange-300" :
                            "bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-300"
                        }`}>
                        {booking.status === 'confirmed' && <CheckCircleIcon size={24} weight="fill" />}
                        {booking.status === 'pending' && <ClockIcon size={24} weight="fill" className="animate-pulse" />} {/* Import Clock if needed, reused check circle/x circle */}
                        {booking.status === 'cancelled' && <XCircleIcon size={24} weight="fill" />}
                        <div>
                            <p className="font-bold text-sm uppercase tracking-wide">
                                {booking.status}
                            </p>
                            <p className="text-xs opacity-80">
                                {booking.status === 'pending' ? "Awaiting your confirmation" :
                                    booking.status === 'confirmed' ? "Booking is confirmed" : "Booking was cancelled"}
                            </p>
                        </div>
                    </div>

                    {/* Guest Info */}
                    <section>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <UserIcon size={18} className="text-primary" />
                            Guest Information
                        </h3>
                        <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                    {booking.guest.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-stone-900 dark:text-white">
                                        {booking.guest}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        Verified Guest
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                                    <EnvelopeSimpleIcon size={16} />
                                    {booking.email}
                                </div>
                                <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                                    <PhoneIcon size={16} />
                                    {booking.phone}
                                </div>
                                <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                                    <MapPinIcon size={16} />
                                    <span>Kathmandu, Nepal</span> {/* Mock location */}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Booking Details */}
                    <section>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <CalendarBlankIcon size={18} className="text-primary" />
                            Stay Details
                        </h3>
                        <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                            <div className="p-4 bg-stone-50 dark:bg-stone-800/30 border-b border-stone-200 dark:border-stone-800">
                                <p className="font-semibold text-stone-900 dark:text-white text-sm">
                                    {booking.property}
                                </p>
                                <p className="text-xs text-stone-500">
                                    Entire Unit • 1 Bedroom • 1 Bathroom
                                </p>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-stone-200 dark:divide-stone-800">
                                <div className="p-4">
                                    <p className="text-xs text-stone-500 mb-1">Check-in</p>
                                    <p className="font-semibold text-stone-900 dark:text-white text-sm">
                                        {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1">
                                        After 2:00 PM
                                    </p>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-stone-500 mb-1">Check-out</p>
                                    <p className="font-semibold text-stone-900 dark:text-white text-sm">
                                        {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1">
                                        Before 11:00 AM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Breakdown */}
                    <section>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <ReceiptIcon size={18} className="text-primary" />
                            Payment Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-stone-600 dark:text-stone-400">
                                <span>{nights} nights x NPR {(booking.amount / nights).toFixed(0)}</span>
                                <span>NPR {booking.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-stone-600 dark:text-stone-400">
                                <span>Cleaning fee</span>
                                <span>NPR 0</span>
                            </div>
                            <div className="flex justify-between text-stone-600 dark:text-stone-400">
                                <span>Service fee</span>
                                <span>NPR 0</span>
                            </div>
                            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center font-bold text-stone-900 dark:text-white text-base">
                                <span>Total (NPR)</span>
                                <span>{booking.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                    {booking.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => { onAction(booking.id, 'cancel'); onClose(); }}
                                className="px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-xl font-semibold text-sm transition"
                            >
                                Reject Request
                            </button>
                            <button
                                onClick={() => { onAction(booking.id, 'confirm'); onClose(); }}
                                className="px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-semibold text-sm transition shadow-sm shadow-green-600/20"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    ) : (
                        <button
                            className="w-full px-4 py-3 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl font-semibold text-sm transition"
                        >
                            Message Guest
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
