"use client";

import { MagnifyingGlassIcon, MapPinIcon, CalendarCheckIcon, UsersIcon } from "@phosphor-icons/react";

export default function SearchBar() {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-4 shadow-md dark:bg-gray-900 md:p-2 border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:gap-2">
                {/* Location */}
                <div className="relative flex items-center rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors cursor-pointer group">
                    <MapPinIcon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors mr-3" weight="bold" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Kathmandu</span>
                    </div>
                </div>

                {/* Check In */}
                <div className="relative flex items-center rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors cursor-pointer group border-l-0 md:border-l border-white dark:border-gray-900 border-r-0 md:border-r">
                    <CalendarCheckIcon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors mr-3" weight="bold" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Dates</span>
                    </div>
                </div>

                {/* Check Out */}
                <div className="relative flex items-center rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors cursor-pointer group border-r-0 md:border-r border-white dark:border-gray-900">
                    <CalendarCheckIcon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors mr-3" weight="bold" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Dates</span>
                    </div>
                </div>

                {/* Guests */}
                <div className="relative flex items-center rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors cursor-pointer group">
                    <UsersIcon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors mr-3" weight="bold" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Guests</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Guests</span>
                    </div>
                </div>

                {/* Button */}
                <button className="flex h-full w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-ornange-700 hover:shadow-blue-500/40 active:scale-95 md:w-auto md:min-w-[60px]">
                    <MagnifyingGlassIcon size={24} weight="bold" className="scale-125" />
                    <span className="ml-2 md:hidden">Search</span>
                </button>
            </div>
        </div>
    );
}
