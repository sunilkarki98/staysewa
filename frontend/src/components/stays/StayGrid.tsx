"use client";

import { useUserIntent } from "../../context/UserIntentContext";
import { MOCK_STAYS } from "../../data/stays";
import StayCard from "./StayCard";
import type { SortOption } from "./SortBar";

type StayGridProps = {
    sort: SortOption;
};

export default function StayGrid({ sort }: StayGridProps) {
    const { category } = useUserIntent();

    let stays = MOCK_STAYS.filter((stay) => stay.type === category);

    // 🔽 Sorting logic
    if (sort === "price_low") {
        stays = [...stays].sort((a, b) => a.price - b.price);
    }

    if (sort === "price_high") {
        stays = [...stays].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        stays = [...stays].sort((a, b) => b.rating - a.rating);
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            <h2 className="mb-6 text-xl font-semibold capitalize text-gray-900 dark:text-white">
                {category} in Nepal
            </h2>

            {stays.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No stays available right now.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {stays.map((stay) => (
                        <StayCard key={stay.id} {...stay} />
                    ))}
                </div>
            )}
        </section>
    );
}
