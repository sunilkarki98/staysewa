export default function Filters() {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold">Filters</h3>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Free Wi-Fi
            </label>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Private Room
            </label>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Power Backup
            </label>
        </div>
    );
}
