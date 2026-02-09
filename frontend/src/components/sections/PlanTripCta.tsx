import Image from "next/image";

export default function PlanTripCTA() {
    return (
        <section className="relative h-65 w-full overflow-hidden rounded-none">
            {/* Background Image */}
            <Image
                src="/cta/kathmandu.jpg" // <-- your image path
                alt="Kathmandu city view"
                fill
                priority
                className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4">
                <div className="max-w-xl text-white">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Plan Your Trip to Kathmandu
                    </h2>
                    <p className="mt-2 text-sm text-white/90">
                        Safe, Affordable, and Easy to Book
                    </p>

                    <button
                        className="mt-4 inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
}
