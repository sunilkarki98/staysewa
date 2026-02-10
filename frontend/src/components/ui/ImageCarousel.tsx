"use client";

import { useState, useEffect, useCallback } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Image from "next/image";

type ImageCarouselProps = {
    images: string[];
    alt: string;
    autoScrollInterval?: number; // in ms, default 4000
};

export default function ImageCarousel({
    images,
    alt,
    autoScrollInterval = 4000,
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Auto-scroll effect
    useEffect(() => {
        if (isPaused || images.length <= 1 || autoScrollInterval <= 0) return;

        const interval = setInterval(goToNext, autoScrollInterval);
        return () => clearInterval(interval);
    }, [isPaused, images.length, autoScrollInterval, goToNext]);

    if (images.length === 0) {
        return (
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
            </div>
        );
    }

    return (
        <div
            className="relative h-full w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Images Container */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="relative h-full w-full flex-shrink-0">
                        <Image
                            src={src}
                            alt={`${alt} - ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - only show if multiple images */}
            {images.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/70 text-gray-700 dark:text-white shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white dark:hover:bg-black hover:scale-110"
                        aria-label="Previous image"
                    >
                        <CaretLeft size={16} weight="bold" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/70 text-gray-700 dark:text-white shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white dark:hover:bg-black hover:scale-110"
                        aria-label="Next image"
                    >
                        <CaretRight size={16} weight="bold" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
