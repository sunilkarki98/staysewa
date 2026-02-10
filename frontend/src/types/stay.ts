export type StayCategory = "hostels" | "flats" | "homestays";
export type StayIntent = "short-stay" | "long-stay";

export type StayType = {
  category: StayCategory;
  intent: StayIntent;
};

export type Stay = {
  id: string;
  name: string;
  type: StayCategory; // "hostels" | "flats" | "homestays"
  intent: StayIntent; // "short-stay" | "long-stay"

  location: string;
  images: string[];

  price: number;
  rating: number;
  reviews?: number; // Count of reviews

  // Optional details for full view
  description?: string;
  amenities?: string[];
  rules?: string[];

  // Meta
  createdAt?: string;
  updatedAt?: string;
};
