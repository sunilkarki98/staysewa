export type StayType = "hostel" | "flat" | "homestay";

export type Stay = {
  id: string;
  name: string;
  type: StayType;

  location: string;
  images: string[]; // Changed from single image to array

  price: number;
  rating: number;

  // optional but future-proof
  badge?: string; // e.g. "Entire Flat"
};
