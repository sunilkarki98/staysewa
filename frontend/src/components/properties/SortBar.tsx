export type SortOption =
    | "recommended"
    | "price_low"
    | "price_high"
    | "rating";

type SortBarProps = {
    value: SortOption;
    onChange: (value: SortOption) => void;
};

export default function SortBar({ value, onChange }: SortBarProps) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Sort by:</span>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
            >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
            </select>
        </div>
    );
}
