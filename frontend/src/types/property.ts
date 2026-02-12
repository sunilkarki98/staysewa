// ─── Backend-aligned enums ──────────────────────────────────
export type PropertyCategory = 'hotel' | 'resort' | 'homestay' | 'apartment' | 'room' | 'hostel';
export type PropertyStatus = 'draft' | 'pending' | 'active' | 'published' | 'archived' | 'rejected';
export type UnitType = 'private_room' | 'shared_room' | 'entire_place' | 'bed' | 'single_room' | 'double_room' | '1BHK' | '2BHK' | '3BHK' | 'villa';

// ─── Property Unit (Room/Bed) ───────────────────────────────────
export type PropertyUnit = {
    id?: string;
    property_id: string;
    name: string;
    type: UnitType;
    max_occupancy: number;
    base_price: number; // in Paisa
    quantity: number;
    amenities: string[];
    is_active?: boolean;
    attributes?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
};

// ─── Main Property Type ─────────────────────────────────────────
export type Property = {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    description?: string;
    type: PropertyCategory;
    status: PropertyStatus;

    // Address
    address_line: string;
    city: string;
    district: string;
    province?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;

    // Pricing
    base_price: number; // base price in Paisa
    currency: string;

    // Capacity
    max_guests?: number;
    bedrooms?: number;
    bathrooms?: number;
    beds?: number;

    // Policies
    amenities?: string[];
    rules?: string[];
    check_in_time?: string;
    check_out_time?: string;
    min_nights?: number;
    max_nights?: number;

    // Stats
    avg_rating: number;
    total_reviews: number;
    total_bookings: number;
    is_featured: boolean;

    // Relations
    units?: PropertyUnit[];
    media?: Array<{
        id: string;
        url: string;
        type: string;
        label?: string;
        is_cover?: boolean;
    }>;

    created_at?: string;
    updated_at?: string;
};

// ─── Helper labels ──────────────────────────────────────────
export const PROPERTY_TYPE_LABELS: Record<PropertyCategory, string> = {
    hotel: 'Hotel',
    resort: 'Resort',
    homestay: 'Homestay',
    apartment: 'Apartment',
    room: 'Room',
    hostel: 'Hostel',
};
