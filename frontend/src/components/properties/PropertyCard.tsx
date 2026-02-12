"use client";

import { MapPin, Star } from "@phosphor-icons/react";
import type { PropertyCategory } from "../../types/property";
import ImageCarousel from "../ui/ImageCarousel";
import { Card } from "../ui/Card";
import Button from "../ui/Button";

type PropertyCardProps = {
    id: string;
    name: string;
    images: string[];
    location: string;
    price: number;
    rating: number;
    type: PropertyCategory;
};

export default function PropertyCard({
    id,
    name,
    images,
    location,
    price,
    rating,
    type,
}: PropertyCardProps) {
    return (
        <Card hoverEffect className="group relative border-border dark:border-gray-800 bg-white dark:bg-gray-900 h-full">
            {/* Image Carousel */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <ImageCarousel images={images} alt={name} />

                {/* Type Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white shadow-sm">
                        {type}
                    </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-lg bg-surface/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 shadow-sm">
                        <Star weight="fill" className="text-secondary" size={14} />
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
                            <MapPin size={14} weight="fill" />
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
                            / {type === 'apartment' ? 'month' : 'night'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            href="/login"
                            variant="primary"
                            size="sm"
                            className="bg-primary text-white"
                        >
                            Book Now
                        </Button>
                        <Button
                            href={`/properties/${id}`}
                            variant="outline"
                            size="sm"
                            className="border-primary/30 text-primary hover:bg-primary/5"
                        >
                            See More
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
