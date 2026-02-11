"use client";

import { MapPinIcon, StarIcon } from "@phosphor-icons/react";
import type { StayCategory, StayIntent } from "../../types/stay";
import ImageCarousel from "../ui/ImageCarousel";

type StayCardProps = {
    id: string;
    name: string;
    images: string[]; // Changed from single image to array
    location: string;
    price: number;
    rating: number;
    type: StayCategory;
    intent: StayIntent;
};

import Link from "next/link";

export default function StayCard({
    id,
    name,
    images,
    location,
    price,
    rating,
    type,
}: StayCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border dark:border-gray-800 bg-white dark:bg-gray-900 transition-all hover:shadow-xl hover:-translate-y-1">
            {/* Image Carousel */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <ImageCarousel images={images} alt={name} />

                {/* Type Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white shadow-sm">
                        {type.slice(0, -1)} {/* Remove 's' from type */}
                    </span>
                </div>

                {/* Rating Badge - Prominent */}
                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-lg bg-surface/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 shadow-sm">
                        <StarIcon weight="fill" className="text-secondary" size={14} />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{rating}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 bg-neutral dark:bg-slate-900/50">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <h3 className="text-base font-bold text-text dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-muted dark:text-gray-400">
                            <MapPinIcon size={14} weight="fill" />
                            <span className="text-xs font-medium truncate">{location}</span>
                        </div>
                    </div>
                </div>
                <div className="pt-3 border-t border-border dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-text dark:text-white">
                            NPR {price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted dark:text-gray-400 font-medium ml-1">
                            / {type === 'flats' ? 'month' : 'night'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Book Now
                        </Link>
                        <Link
                            href={`/stays/${id}`}
                            className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                            See More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
