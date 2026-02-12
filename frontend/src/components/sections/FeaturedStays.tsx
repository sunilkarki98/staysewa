"use client";

import { useState, useRef } from "react";
import StayCard from "../stays/StayCard";
import type { StayCategory } from "../../types/stay";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useStays } from "../../hooks/useStays";
import Button from "../ui/Button";

type Tab = "all" | StayCategory;

type FeaturedStaysProps = {
    compact?: boolean;
};

export default function FeaturedStays({ compact = false }: FeaturedStaysProps) {
    const { stays, loading } = useStays();
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredStays = activeTab === "all"
        ? stays
        : stays.filter((stay) => stay.type === activeTab);

    const displayStays = filteredStays.slice(0, 8);

    const getLink = () => {
        switch (activeTab) {
            case "apartment": return "/flats";
            case "homestay": return "/homestays";
            case "hostel": return "/hostels";
            default: return "/explore";
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.children[0]?.clientWidth || 320;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(Math.min(index, displayStays.length - 1));
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const firstCard = container.querySelector('.snap-start') as HTMLElement;
            const cardWidth = firstCard?.offsetWidth || 300;
            const gap = 24;
            const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className={compact ? "py-2" : "pt-32 pb-8 bg-stone-50 dark:bg-stone-950"}>
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Header & Tabs */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 ${compact ? "mb-6" : "mb-12"}`}>
                    {!compact && (
                        <div>
                            <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
                                Top Rated Stays
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400 max-w-xl text-sm leading-relaxed">
                                Whether you need a short-term hostel, a private flat for a month, or an authentic homestay experience, we have it all.
                            </p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-x-auto md:overflow-visible scrollbar-hide">
                        {(["all", "hostel", "apartment", "homestay"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    relative px-5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap z-10
                                    ${activeTab === tab
                                        ? "text-white"
                                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"}
                                `}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-lg shadow-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 capitalize tracking-wide">
                                    {tab === "all" ? "All Stays" : tab}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex gap-6 overflow-hidden pb-4 pt-2 px-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                                <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Carousel Container */}
                        <div className="relative group/carousel">
                            <motion.div
                                layout
                                ref={scrollRef}
                                onScroll={handleScroll}
                                id="stays-carousel"
                                className="flex gap-6 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x snap-mandatory"
                                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <AnimatePresence mode="popLayout">
                                    {displayStays.map((stay) => (
                                        <motion.div
                                            key={stay.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-none snap-start w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                                        >
                                            <StayCard {...stay} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-stone-50 dark:from-stone-950 to-transparent pointer-events-none md:hidden" />
                        </div>

                        {/* Controls & Nav */}
                        <div className="mt-12 flex flex-col items-center gap-8">
                            {/* Dot Indicators */}
                            <div className="flex items-center gap-2">
                                {displayStays.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (scrollRef.current) {
                                                const container = scrollRef.current;
                                                const card = container.querySelector('.snap-start') as HTMLElement;
                                                if (card) {
                                                    const cardWidth = card.offsetWidth;
                                                    const gap = 24;
                                                    scrollRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "w-6 bg-primary"
                                            : "w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                                            }`}
                                        aria-label={`Go to item ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Navigation Buttons & View All */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => scroll('left')}
                                    className="h-12 w-12 flex items-center justify-center rounded-full bg-surface dark:bg-stone-900 text-text dark:text-white border border-border dark:border-stone-800 shadow-sm hover:shadow-md hover:bg-orange-50 hover:text-primary hover:border-orange-200 dark:hover:bg-stone-800 dark:hover:text-primary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Scroll left"
                                >
                                    <CaretLeft size={24} weight="bold" />
                                </button>

                                <Button
                                    href={getLink()}
                                    rightIcon={<CaretRight size={18} weight="bold" />}
                                    className="px-8 py-3 text-sm font-bold text-primary-foreground bg-primary dark:bg-primary/90 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    View All {activeTab === "all" ? "Stays" : activeTab}
                                </Button>

                                <button
                                    onClick={() => scroll('right')}
                                    className="h-12 w-12 flex items-center justify-center rounded-full bg-surface dark:bg-stone-900 text-text dark:text-white border border-border dark:border-stone-800 shadow-sm hover:shadow-md hover:bg-orange-50 hover:text-primary hover:border-orange-200 dark:hover:bg-stone-800 dark:hover:text-primary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Scroll right"
                                >
                                    <CaretRight size={24} weight="bold" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
