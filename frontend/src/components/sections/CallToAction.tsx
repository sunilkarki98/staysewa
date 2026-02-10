"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, BackpackIcon, HouseIcon, MapPinIcon } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useUserIntent } from "../../context/UserIntentContext";

export default function CallToAction() {
    const { category } = useUserIntent(); // ✅ destructured
    const location = "Kathmandu";

    const primary =
        category === "flats"
            ? {
                label: "Browse Flats",
                href: "/flats",
                icon: <HouseIcon size={20} weight="bold" />,
            }
            : {
                label: "Explore Hostels",
                href: "/hostels",
                icon: <BackpackIcon size={20} weight="bold" />,
            };

    return (
        <section className="relative overflow-hidden py-24">
            {/* Background Image - No Overlay */}
            <Image src="/images/img2.png" alt="Kathmandu city view" fill priority className="object-cover" />

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-5xl"
                >
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md shadow-lg">
                        <MapPinIcon size={16} weight="fill" className="text-orange-400" />
                        <span>Stays in {location}</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl leading-tight mb-6 p-4">
                        Your next stay is <br className="hidden sm:block" />
                        <span className="text-secondary drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">just a few clicks away</span>
                    </h2>

                    <p className="text-lg md:text-xl text-stone-100 drop-shadow-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
                        Discover verified hostels and short-term flats with transparent pricing, instant booking, and zero brokerage.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/search"
                            className="px-8 py-4 bg-gradient-to-r from-primary to-orange-700 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto text-center"
                        >
                            Find a Stay
                        </Link>

                        <Link
                            href={category === "flats" ? "/hostels" : "/flats"}
                            className="group inline-flex items-center gap-3 rounded-full bg-black/40 border border-white/20 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {category === "flats" ? (
                                <BackpackIcon size={20} weight="bold" />
                            ) : (
                                <HouseIcon size={20} weight="bold" />
                            )}
                            {category === "flats" ? "Explore Hostels" : "Browse Flats"}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
