"use client";

import { useState, useEffect, useCallback } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

type FeaturedCarouselProps = {
    images: string[];
    name: string;
    autoScrollInterval?: number;
};

function FeaturedCarousel({ images, name, autoScrollInterval = 4000 }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (isPaused || images.length <= 1) return;
        const interval = setInterval(goToNext, autoScrollInterval);
        return () => clearInterval(interval);
    }, [isPaused, images.length, autoScrollInterval, goToNext]);

    return (
        <div
            className="relative h-56 w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`${name} - ${index + 1}`}
                        className="h-full w-full flex-shrink-0 object-cover"
                    />
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/70 text-gray-700 dark:text-white shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                        <CaretLeftIcon size={18} weight="bold" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/70 text-gray-700 dark:text-white shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                        <CaretRightIcon size={18} weight="bold" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

import { hostels } from "../../data/hostels";

export default function PopularHostels() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
            <h2 className="text-center text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                Popular Hostels in Kathmandu
            </h2>

            <div className="mx-auto grid gap-4 px-3 sm:grid-cols-2 lg:grid-cols-4 max-w-[1400px]">
                {hostels.map((h) => (
                    <div
                        key={h.id}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <FeaturedCarousel images={h.images} name={h.name} />
                        <div className="p-4 ">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{h.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">NPR {h.price} / night</p>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                    href={`/login?redirect=/book/${h.id}`}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
                                >
                                    Book
                                </Link>
                                <Link
                                    href={`/login?redirect=/stays/${h.id}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    See More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
