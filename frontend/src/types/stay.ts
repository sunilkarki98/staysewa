// ─── Backend-aligned enums ──────────────────────────────────
export type StayCategory = 'hotel' | 'homestay' | 'apartment' | 'room' | 'hostel';
export type StayIntent = 'short_stay' | 'long_stay' | 'both';
export type StayStatus = 'draft' | 'pending_review' | 'active' | 'suspended' | 'archived';
export type UnitType = 'private_room' | 'shared_room' | 'entire_place' | 'bed';

// ─── Stay Unit (Room/Bed) ───────────────────────────────────
export type StayUnit = {
  id?: string; // Optional for new units before saving
  name: string;
  type: UnitType;
  maxOccupancy: number;
  basePrice: number; // in Paisa
  quantity: number;
  amenities: string[];
  isActive?: boolean;
};

// ─── Main Stay Type ─────────────────────────────────────────
export type Stay = {
  id: string;
  name: string;
  type: StayCategory;
  intent: StayIntent;
  status?: StayStatus;

  // Location
  location: string; // display string (city, district)
  addressLine?: string;
  city?: string;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;

  images: string[];
  price: number; // base price in Paisa
  rating: number;
  reviews?: number;

  // Details
  description?: string;
  amenities?: string[];
  rules?: string[];
  maxGuests?: number;
  checkInTime?: string;
  checkOutTime?: string;

  // Relations (populated on detail view)
  stayUnits?: StayUnit[];
  stayMedia?: Array<{
    id: string;
    url: string;
    type: string;
    caption?: string;
    isCover?: boolean;
  }>;

  // Meta
  createdAt?: string;
  updatedAt?: string;
};

// ─── Helper labels ──────────────────────────────────────────
export const STAY_TYPE_LABELS: Record<StayCategory, string> = {
  hotel: 'Hotel',
  homestay: 'Homestay',
  apartment: 'Apartment',
  room: 'Room',
  hostel: 'Hostel',
};

export const STAY_INTENT_LABELS: Record<StayIntent, string> = {
  short_stay: 'Short Stay',
  long_stay: 'Long Stay',
  both: 'Both',
};
