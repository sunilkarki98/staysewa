"use client";

import Link from "next/link";
import Image from "next/image";
import {
    FacebookLogoIcon,
    InstagramLogoIcon,
    TwitterLogoIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon
} from "@phosphor-icons/react";
import Container from "./Container";

const Footer = () => {
    return (
        <footer className="w-full bg-neutral dark:bg-stone-950 border-t border-border dark:border-stone-800 py-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                    {/* 1. Brand Section (Wider) */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-700 bg-clip-text text-transparent">
                                StaySewa
                            </span>
                        </Link>
                        <p className="text-muted dark:text-stone-400 text-base leading-relaxed max-w-sm">
                            Your trusted partner for verified hostels, homestays, and short-term rentals in Kathmandu. Experience comfort and authentic hospitality.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink
                                href="https://facebook.com"
                                icon={<FacebookLogoIcon size={22} weight="fill" />}
                                label="Facebook"
                                hoverClass="hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10"
                            />
                            <SocialLink
                                href="https://instagram.com"
                                icon={<InstagramLogoIcon size={22} weight="fill" />}
                                label="Instagram"
                                hoverClass="hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10"
                            />
                            <SocialLink
                                href="https://twitter.com"
                                icon={<TwitterLogoIcon size={22} weight="fill" />}
                                label="Twitter"
                                hoverClass="hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10"
                            />
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white mb-5">Company</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/blog">Travel Blog</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* 3. Support */}
                    <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white mb-5">Legal & Support</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/help">Help Center</FooterLink>
                            <FooterLink href="/safety">Safety Tips</FooterLink>
                        </ul>
                    </div>

                    {/* 4. Newsletter / Play Store */}
                    <div className="lg:col-span-1">
                        <h3 className="text-base font-bold text-text dark:text-white mb-5">Get Updates</h3>
                        <form className="flex flex-col gap-3 mb-6">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-2.5 rounded-lg bg-surface dark:bg-stone-900 border border-border dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                            />
                            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-4 rounded-lg transition-colors text-base shadow-sm">
                                Subscribe
                            </button>
                        </form>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <PhoneIcon size={20} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Support Line</p>
                                <p className="text-base font-bold text-stone-900 dark:text-white">+977 9800000000</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-base text-stone-500 dark:text-stone-400">
                        © {new Date().getFullYear()} StaySewa. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        {/* Optional Links in Bottom Bar */}
                        <div className="hidden md:flex gap-6 text-sm text-stone-500 dark:text-stone-400 font-medium">
                            <Link href="/sitemap" className="hover:text-orange-600 transition-colors">Sitemap</Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider hidden sm:inline-block">Verified Payments:</span>
                            <div className="flex gap-2">
                                <Image src="/paymenticons/esewa.png" alt="eSewa" width={60} height={24} className="h-7 w-auto" />
                                <Image src="/paymenticons/khalti.png" alt="Khalti" width={60} height={24} className="h-7 w-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

const SocialLink = ({ href, icon, label, hoverClass }: { href: string; icon: React.ReactNode; label: string, hoverClass: string }) => (
    <Link
        href={href}
        target="_blank"
        aria-label={label}
        className={`w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 transition-all shadow-sm ${hoverClass}`}
    >
        {icon}
    </Link>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link
            href={href}
            className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
            {children}
        </Link>
    </li>
);

export default Footer;
