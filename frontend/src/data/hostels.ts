import { Stay } from "../types/stay";

export const hostels: Stay[] = [
  {
    id: "h1",
    name: "Kathmandu Backpackers",
    type: "hostel",
    location: "Thamel",
    images: ["/images/heroimg1.png", "/images/img2.png"],
    price: 12,
    rating: 4.6,
  },
  {
    id: "h2",
    name: "Thamel Youth Hostel",
    type: "hostel",
    location: "Thamel",
    images: ["/images/img2.png", "/images/heroimg1.png"],
    price: 10,
    rating: 4.4,
  },
  {
    id: "h3",
    name: "Mountain View Hostel",
    type: "hostel",
    location: "Patan",
    images: ["/images/heroimg1.png", "/images/img2.png"],
    price: 15,
    rating: 4.7,
  },
  {
    id: "h4",
    name: "Cozy Corner Hostel",
    type: "hostel",
    location: "Bhaktapur",
    images: ["/images/img2.png", "/images/heroimg1.png"],
    price: 8,
    rating: 4.2,
  },
];
