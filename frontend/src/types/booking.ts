export type BookingStatus = "pending" | "confirmed" | "cancelled" | "reserved" | "expired";

export interface Booking {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    property_id: string;
    property_name?: string;
    unit_id?: string;
    check_in: string; // ISO Date string YYYY-MM-DD
    check_out: string; // ISO Date string YYYY-MM-DD
    status: BookingStatus;
    total_amount: number; // in Paisa

    // Optional details for drawer/full view
    guests_count?: number;
    special_requests?: string;
    payment_status?: "paid" | "unpaid" | "partial";
    created_at?: string;
}
