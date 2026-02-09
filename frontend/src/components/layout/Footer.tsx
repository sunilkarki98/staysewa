"use client";

import Link from "next/link";
import Image from "next/image";
import { FacebookLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react";

const Footer = () => {
    return (
        <footer className="w-full bg-slate-100 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/90 dark:bg-zinc-900/90 border border-slate-200/50 dark:border-zinc-800/50 rounded-3xl shadow-lg px-8 py-6 backdrop-blur-md">

                    {/* Left: Links */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition">About Us</Link>
                        <Link href="/faqs" className="hover:text-gray-900 dark:hover:text-white transition">FAQs</Link>
                        <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition">Terms & Policies</Link>
                        <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition">Contact Us</Link>
                        <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition">Login</Link>
                        <Link
                            href="/owner"
                            className="ml-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-blue-700 hover:shadow-md active:scale-95"
                        >
                            List Your Property
                        </Link>
                    </div>

                    {/* Center: Payments */}
                    <div className="flex items-center gap-6 mt-6 md:mt-0">
                        <Image src="/payments/esewa.svg" alt="eSewa" width={80} height={32} className="h-10 w-auto" />
                        <Image src="/payments/khalti.svg" alt="Khalti" width={80} height={32} className="h-10 w-auto" />
                        <Image src="/payments/fonepay.svg" alt="Fonepay" width={80} height={32} className="h-10 w-auto" />
                    </div>

                    {/* Right: Social + Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mt-6 md:mt-0">
                        <div className="flex items-center gap-5">
                            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                                <FacebookLogoIcon size={36} weight="fill" className="text-[#1877F2]" />
                            </Link>
                            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                                <InstagramLogoIcon size={36} weight="fill" className="text-pink-500" />
                            </Link>
                        </div>
                        <div className="text-lg text-gray-700 dark:text-gray-300 font-medium text-center md:text-right">
                            © 2024 <span className="font-bold text-gray-900 dark:text-gray-200">StaySewa</span>. All rights reserved.
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
