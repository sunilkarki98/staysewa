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
        <section className="relative overflow-hidden py-24 md:py-32">
            {/* Background Image */}
            <Image src="/images/img2.png" alt="Kathmandu city view" fill priority className="object-cover" />

            {/* Cinematic Overlay - Darker and richer */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/80" />



            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-4xl"
                >
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-900 border border-gray-700 px-5 py-2 text-sm font-medium text-white shadow-lg">
                        <MapPinIcon size={16} weight="fill" className="text-blue-400" />
                        <span>Stays in {location}</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl leading-tight">
                        Your next stay is <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">just a few clicks away</span>
                    </h2>

                    <p className="mt-6 text-lg md:text-xl text-gray-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        Discover verified hostels and short-term flats with transparent pricing, instant booking, and zero brokerage.
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
                        <Link
                            href={primary.href}
                            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
                        >
                            {primary.icon}
                            {primary.label}
                            <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href={category === "flats" ? "/hostels" : "/flats"}
                            className="group inline-flex items-center gap-3 rounded-full border border-white/40 bg-transparent px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/60"
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
