import { Booking } from "../types/booking";

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: "BK-7821",
        guest: "Sarah Jenkins",
        email: "sarah.j@email.com",
        phone: "+977-9841234567",
        property: "Sunny Hostel",
        checkIn: "2024-03-15",
        checkOut: "2024-03-20",
        status: "pending",
        amount: 4500,
        guestsCount: 1
    },
    {
        id: "BK-7822",
        guest: "Rajesh Kumar",
        email: "rajesh.k@email.com",
        phone: "+977-9812345678",
        property: "Modern Flat",
        checkIn: "2024-03-18",
        checkOut: "2024-04-18",
        status: "confirmed",
        amount: 45000,
        guestsCount: 2
    },
    {
        id: "BK-7823",
        guest: "Elena Rodriguez",
        email: "elena.r@email.com",
        phone: "+977-9867654321",
        property: "Cozy Homestay",
        checkIn: "2024-03-22",
        checkOut: "2024-03-25",
        status: "cancelled",
        amount: 7500,
        guestsCount: 4
    },
    {
        id: "BK-7824",
        guest: "Mike Chen",
        email: "mike.c@email.com",
        phone: "+977-9801112233",
        property: "Sunny Hostel",
        checkIn: "2024-04-01",
        checkOut: "2024-04-05",
        status: "pending",
        amount: 3600,
        guestsCount: 1
    },
    {
        id: "BK-7825",
        guest: "Priya Sharma",
        email: "priya.s@email.com",
        phone: "+977-9855443322",
        property: "Luxury Apt",
        checkIn: "2024-04-10",
        checkOut: "2024-04-15",
        status: "confirmed",
        amount: 22000,
        guestsCount: 3
    },
];
