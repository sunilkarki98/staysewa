"use client";

import { useState, useRef } from "react";
import { MagnifyingGlassIcon, MapPinIcon, CalendarCheckIcon, UsersIcon, PlusIcon, MinusIcon } from "@phosphor-icons/react";

export default function SearchBar() {
    const [location, setLocation] = useState("Kathmandu");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [counts, setCounts] = useState({
        male: 0,
        female: 0,
        others: 0
    });
    const [showGuestMenu, setShowGuestMenu] = useState(false);

    const checkInRef = useRef<HTMLInputElement>(null);
    const checkOutRef = useRef<HTMLInputElement>(null);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Add Dates";
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const totalGuests = counts.male + counts.female + counts.others;

    const guestLabel = () => {
        if (totalGuests === 0) return "Add Guests";
        const parts = [];
        if (counts.male > 0) parts.push(`${counts.male}M`);
        if (counts.female > 0) parts.push(`${counts.female}F`);
        if (counts.others > 0) parts.push(`${counts.others}O`);
        return parts.join(", ");
    };

    const updateCount = (key: keyof typeof counts, delta: number) => {
        setCounts(prev => ({
            ...prev,
            [key]: Math.max(0, prev[key] + delta)
        }));
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4">
            <div className="relative overflow-visible rounded-2xl bg-white/20 backdrop-blur-xl p-3 shadow-2xl border border-white/30 dark:bg-black/20 dark:border-white/10">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center">

                    {/* Location */}
                    <div className="col-span-2 md:col-span-1 relative flex items-center rounded-xl bg-white/40 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10 transition-all cursor-text group">
                        <MapPinIcon size={20} className="text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors mr-3 md:w-6 md:h-6" weight="bold" />
                        <div className="flex flex-col flex-1">
                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest">Location</span>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-gray-900 dark:text-white outline-none placeholder-gray-500 w-full"
                                placeholder="where are you going?"
                            />
                        </div>
                    </div>

                    {/* Check In */}
                    <div
                        onClick={() => checkInRef.current?.showPicker()}
                        className="col-span-1 relative flex items-center rounded-xl bg-white/40 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10 transition-all cursor-pointer group"
                    >
                        <CalendarCheckIcon size={20} className="text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors mr-2 md:mr-3 md:w-6 md:h-6" weight="bold" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest truncate">Check In</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {formatDate(checkIn)}
                            </span>
                        </div>
                        <input
                            ref={checkInRef}
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setCheckIn(e.target.value)}
                        />
                    </div>

                    {/* Check Out */}
                    <div
                        onClick={() => checkOutRef.current?.showPicker()}
                        className="col-span-1 relative flex items-center rounded-xl bg-white/40 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10 transition-all cursor-pointer group"
                    >
                        <CalendarCheckIcon size={20} className="text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors mr-2 md:mr-3 md:w-6 md:h-6" weight="bold" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest truncate">Check Out</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {formatDate(checkOut)}
                            </span>
                        </div>
                        <input
                            ref={checkOutRef}
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                    </div>

                    {/* Guests */}
                    <div className="col-span-2 md:col-span-1 relative group/guests">
                        <div
                            onClick={() => setShowGuestMenu(!showGuestMenu)}
                            className="relative flex items-center rounded-xl bg-white/40 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <UsersIcon size={20} className="text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors mr-3 md:w-6 md:h-6" weight="bold" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest">Guests</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {guestLabel()}
                                </span>
                            </div>
                        </div>

                        {showGuestMenu && (
                            <div className="absolute top-full right-0 mt-2 w-full md:w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-800 z-50">
                                <div className="space-y-4">
                                    <GuestCounter label="Male" count={counts.male} onUpdate={(d) => updateCount('male', d)} />
                                    <GuestCounter label="Female" count={counts.female} onUpdate={(d) => updateCount('female', d)} />
                                    <GuestCounter label="Others" count={counts.others} onUpdate={(d) => updateCount('others', d)} />
                                </div>
                                <button
                                    onClick={() => setShowGuestMenu(false)}
                                    className="w-full mt-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <button className="col-span-2 md:col-span-1 flex h-full w-full items-center justify-center rounded-xl bg-orange-600 px-6 py-3 md:py-4 font-bold text-white shadow-[0_10px_20px_-5px_rgba(234,88,12,0.4)] transition-all hover:bg-orange-700 hover:scale-[1.02] active:scale-95 md:w-auto min-w-[64px]">
                        <MagnifyingGlassIcon size={24} className="md:w-[26px] md:h-[26px]" weight="bold" />
                        <span className="ml-2 md:hidden font-bold uppercase tracking-wider text-sm">Search</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const GuestCounter = ({ label, count, onUpdate }: { label: string; count: number; onUpdate: (delta: number) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{label}</span>
        <div className="flex items-center gap-3">
            <button
                onClick={(e) => { e.stopPropagation(); onUpdate(-1); }}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                disabled={count === 0}
            >
                <MinusIcon size={14} weight="bold" />
            </button>
            <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[16px] text-center">{count}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onUpdate(1); }}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
                <PlusIcon size={14} weight="bold" />
            </button>
        </div>
    </div>
);
