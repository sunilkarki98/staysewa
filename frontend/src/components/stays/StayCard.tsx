"use client";

import { MapPinIcon, StarIcon } from "@phosphor-icons/react";
import type { StayCategory } from "../../types/stay-types";
import ImageCarousel from "../ui/ImageCarousel";

type StayCardProps = {
    id: string;
    name: string;
    images: string[]; // Changed from single image to array
    location: string;
    price: number;
    rating: number;
    type: StayCategory;
};

export default function StayCard({
    name,
    images,
    location,
    price,
    rating,
    type,
}: StayCardProps) {
    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition hover:shadow-lg cursor-pointer">
            {/* Image Carousel */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <ImageCarousel images={images} alt={name} autoScrollInterval={5000} />
            </div>

            {/* Content */}
            <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        NPR {price}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPinIcon size={14} />
                    {location}
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                        <StarIcon weight="fill" size={14} />
                        {rating}
                    </span>

                    <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs capitalize text-blue-600 dark:text-blue-400">
                        {type}
                    </span>
                </div>
            </div>
        </div>
    );
}
