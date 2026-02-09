import type { StayCategory } from "../types/stay-types";

export type Stay = {
  id: string;
  name: string;
  images: string[];
  location: string;
  price: number;
  rating: number;
  type: StayCategory;
};

export const MOCK_STAYS: Stay[] = [
  {
    id: "1",
    name: "Backpackers Hostel Kathmandu",
    images: [
      "/images/heroimg1.png",
      "/images/img2.png",
    ],
    location: "Thamel, Kathmandu",
    price: 900,
    rating: 4.6,
    type: "hostels",
  },
  {
    id: "2",
    name: "Modern City Flat",
    images: [
      "/images/img2.png",
      "/images/heroimg1.png",
    ],
    location: "Lazimpat",
    price: 4500,
    rating: 4.8,
    type: "flats",
  },
  {
    id: "3",
    name: "Peaceful Homestay",
    images: [
      "/images/heroimg1.png",
      "/images/img2.png",
    ],
    location: "Bhaktapur",
    price: 2500,
    rating: 4.7,
    type: "homestays",
  },
  {
    id: "4",
    name: "Thamel Youth Hostel",
    images: [
      "/images/img2.png",
      "/images/heroimg1.png",
    ],
    location: "Thamel, Kathmandu",
    price: 750,
    rating: 4.3,
    type: "hostels",
  },
  {
    id: "5",
    name: "Luxury Apartment Durbar Marg",
    images: [
      "/images/heroimg1.png",
      "/images/img2.png",
    ],
    location: "Durbar Marg",
    price: 8500,
    rating: 4.9,
    type: "flats",
  },
  {
    id: "6",
    name: "Traditional Newari Homestay",
    images: [
      "/images/img2.png",
      "/images/heroimg1.png",
    ],
    location: "Patan",
    price: 3200,
    rating: 4.8,
    type: "homestays",
  },
];
