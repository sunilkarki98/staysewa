"use client";

import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

interface HeroProps {
    location?: string;
}

export default function Hero({ location = "Kathmandu" }: HeroProps) {
    return (
        <section className="relative h-[600px] bg-cover bg-center flex items-center justify-center overflow-visible"
            style={{ backgroundImage: "url(/images/heroimg1.png)" }}
        >


            <div className="relative z-10 max-w-5xl mx-auto text-center text-white px-4 mt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg leading-tight"
                >
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stay</span> <br className="hidden sm:block" /> in {location}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 text-xl md:text-2xl text-gray-100 font-medium max-w-2xl mx-auto drop-shadow-md"
                >
                    Affordable Hostels & Comfortable Flats for Short-Term Travelers.
                </motion.p>
            </div>

            {/* Passing style prop to control positioning of search bar relative to hero bottom */}
            <div className="absolute -bottom-10 left-0 right-0 z-20 px-4">
                <SearchBar />
            </div>
        </section>
    );
}
