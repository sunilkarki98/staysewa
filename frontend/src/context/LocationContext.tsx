"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type LocationContextType = {
    city: string;
    country: string;
    isDetecting: boolean;
    setCity: (city: string) => void;
};

const DEFAULTS = { city: "Kathmandu", country: "Nepal" } as const;
const STORAGE_KEY = "staysewa_detected_location";

// ─── Context ─────────────────────────────────────────────────────────────────
const LocationContext = createContext<LocationContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function LocationProvider({ children }: { children: ReactNode }) {
    const [city, setCityState] = useState<string>(DEFAULTS.city);
    const [country, setCountry] = useState<string>(DEFAULTS.country);
    const [isDetecting, setIsDetecting] = useState(true);

    const setCity = useCallback((newCity: string) => {
        setCityState(newCity);
        try {
            const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "{}"
            );
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ ...stored, city: newCity })
            );
        } catch {
            // localStorage unavailable – ignore
        }
    }, []);

    const applyLocation = useCallback((detectedCity: string, detectedCountry: string) => {
        const isNepal = detectedCountry.toLowerCase().includes("nepal");
        console.log(`[LocationContext] Applying result. City: ${detectedCity}, Country: ${detectedCountry}, IsNepal: ${isNepal}`);

        // Enforce Nepal-only policy (fallback to default if outside Nepal)
        const finalCity = isNepal ? detectedCity : DEFAULTS.city;
        const finalCountry = isNepal ? detectedCountry : DEFAULTS.country;

        setCityState(finalCity);
        setCountry(finalCountry);
        setIsDetecting(false);

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    city: finalCity,
                    country: finalCountry,
                })
            );
        } catch (e) {
            console.error("[LocationContext] Failed to save to localStorage:", e);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initializeLocation = async () => {
            console.log("[LocationContext] Starting detection...");

            // 1. Check localStorage for cached location
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.city && parsed.country && mounted) {
                        console.log("[LocationContext] Using cached location:", parsed.city);
                        setCityState(parsed.city);
                        setCountry(parsed.country);
                        setIsDetecting(false);
                        return;
                    }
                }
            } catch (e) {
                console.error("[LocationContext] LocalStorage error:", e);
            }

            // 2. Attempt browser geolocation → reverse geocode
            try {
                console.log("[LocationContext] Requesting geolocation...");
                const position = await getBrowserPosition();
                if (!mounted) return;

                console.log("[LocationContext] Got position, reverse geocoding...");
                const { lat, lng } = position;
                const geo = await reverseGeocode(lat, lng);

                if (mounted) {
                    console.log("[LocationContext] Reversed geocode result:", geo);
                    applyLocation(geo.city, geo.country);
                }
            } catch (err) {
                if (!mounted) return;
                console.warn("[LocationContext] Geolocation failed:", err);

                // 3. Fallback: IP-based geolocation
                try {
                    console.log("[LocationContext] Attempting IP-based fallback...");
                    const geo = await ipBasedGeocode();
                    if (mounted) {
                        console.log("[LocationContext] IP-based result:", geo);
                        applyLocation(geo.city, geo.country);
                    }
                } catch (ipErr) {
                    if (!mounted) return;
                    console.error("[LocationContext] IP fallback failed:", ipErr);
                    // 4. Final fallback: defaults
                    applyLocation(DEFAULTS.city, DEFAULTS.country);
                }
            }
        };

        initializeLocation();

        return () => {
            mounted = false;
        };
    }, [applyLocation]);

    return (
        <LocationContext.Provider
            value={{ city, country, isDetecting, setCity }}
        >
            {children}
        </LocationContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useLocation(): LocationContextType {
    const ctx = useContext(LocationContext);
    if (!ctx) {
        throw new Error(
            "useLocation must be used inside LocationProvider"
        );
    }
    return ctx;
}

// ─── Helpers (private) ──────────────────────────────────────────────────────

/** Wrap the Geolocation API in a Promise */
function getBrowserPosition(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
            (err) => reject(err),
            { timeout: 8000, maximumAge: 300_000 }
        );
    });
}

/** IP-based geolocation fallback (zero-config, no API key) */
async function ipBasedGeocode(): Promise<{
    city: string;
    country: string;
}> {
    // Try BigDataCloud first
    try {
        const res = await fetch(
            "https://api.bigdatacloud.net/data/reverse-geocode-client"
        );
        if (res.ok) {
            const data = await res.json();
            return parseGeoData(data); // Reusing the same parser!
        }
    } catch (e) {
        console.warn("[LocationContext] BigDataCloud IP fallback failed:", e);
    }

    // Try ipapi.co as secondary fallback
    try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
            const data = await res.json();
            return {
                city: data.city || DEFAULTS.city,
                country: data.country_name || DEFAULTS.country,
            };
        }
    } catch (e) {
        console.error("[LocationContext] Secondary IP fallback failed:", e);
    }

    throw new Error("All IP geocode fallbacks failed");
}

interface BigDataCloudResponse {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
    countryName?: string;
    country_name?: string; // coverage for ipapi fallback structure
    localityInfo?: {
        administrative?: {
            name: string;
            order: number;
        }[];
    };
    [key: string]: unknown;
}

/** Robust field parsing for BigDataCloud results */
function parseGeoData(data: BigDataCloudResponse): { city: string; country: string } {
    const city =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        (data.localityInfo?.administrative?.find((a) => a.order === 4 || a.order === 6)?.name) ||
        DEFAULTS.city;

    const country = data.countryName || data.country_name || DEFAULTS.country;

    return { city, country };
}

/** Reverse geocode using BigDataCloud */
async function reverseGeocode(
    lat: number,
    lng: number
): Promise<{ city: string; country: string }> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    return parseGeoData(data);
}

