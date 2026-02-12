"use client";

export interface AmenitiesRulesData {
    amenities: string[];
    rules: string;
    check_in_time: string;
    check_out_time: string;
}

interface AmenitiesRulesFormProps {
    data: AmenitiesRulesData;
    onChange: (data: AmenitiesRulesData) => void;
}

const AMENITY_OPTIONS = [
    { category: "Essentials", items: ["WiFi", "Hot Water", "Power Backup", "Drinking Water"] },
    { category: "Comfort", items: ["AC", "Heater", "TV", "Washing Machine", "Iron"] },
    { category: "Spaces", items: ["Kitchen", "Garden", "Balcony", "Terrace", "Living Room"] },
    { category: "Safety", items: ["Security", "CCTV", "Fire Extinguisher", "First Aid"] },
    { category: "Facilities", items: ["Parking", "Laundry", "Elevator", "Gym", "Swimming Pool"] },
];

export default function AmenitiesRulesForm({ data, onChange }: AmenitiesRulesFormProps) {
    const toggleAmenity = (amenity: string) => {
        const has = data.amenities.includes(amenity);
        onChange({
            ...data,
            amenities: has
                ? data.amenities.filter((a) => a !== amenity)
                : [...data.amenities, amenity],
        });
    };

    const update = (field: keyof AmenitiesRulesData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                    Amenities & Rules
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    What do you offer? Help guests know what to expect.
                </p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                        Amenities
                    </h3>
                    <span className="text-sm text-stone-500">
                        {data.amenities.length} selected
                    </span>
                </div>

                {AMENITY_OPTIONS.map((group) => (
                    <div key={group.category}>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                            {group.category}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((amenity) => {
                                const selected = data.amenities.includes(amenity);
                                return (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selected
                                            ? "bg-primary/10 border-primary text-primary dark:bg-primary/20"
                                            : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600"
                                            }`}
                                    >
                                        {amenity}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Check-in / Check-out Times */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Check-in & Check-out
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Check-in Time
                        </label>
                        <input
                            type="time"
                            value={data.check_in_time}
                            onChange={(e) => update("check_in_time", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                            Check-out Time
                        </label>
                        <input
                            type="time"
                            value={data.check_out_time}
                            onChange={(e) => update("check_out_time", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                    </div>
                </div>
            </div>

            {/* House Rules */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    House Rules
                </h3>
                <textarea
                    value={data.rules}
                    onChange={(e) => update("rules", e.target.value)}
                    placeholder={"Enter each rule on a new line, e.g.:\nNo smoking indoors\nQuiet hours after 10 PM\nNo pets allowed"}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
                />
                <p className="text-xs text-stone-400">
                    Each line will become a separate rule.
                </p>
            </div>
        </div>
    );
}
