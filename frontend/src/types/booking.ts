export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
    id: string;
    guest: string;
    email: string;
    phone: string;
    property: string;
    checkIn: string; // ISO Date string YYYY-MM-DD
    checkOut: string; // ISO Date string YYYY-MM-DD
    status: BookingStatus;
    amount: number;

    // Optional details for drawer/full view
    guestsCount?: number;
    specialRequests?: string;
    paymentStatus?: "paid" | "unpaid" | "partial";
}
