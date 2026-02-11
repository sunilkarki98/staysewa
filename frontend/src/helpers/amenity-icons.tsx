import {
    WifiHigh,
    Shower,
    Coffee,
    ShieldCheck,
    Car,
    Television,
    Snowflake,
    Thermometer,
    CookingPot,
    Desktop,
    FirstAid,
    FireExtinguisher,
    PawPrint
} from "@phosphor-icons/react";

export const AMENITY_ICONS: Record<string, React.ElementType> = {
    // Common
    "wifi": WifiHigh,
    "internet": WifiHigh,
    "hot_shower": Shower,
    "shower": Shower,
    "breakfast": Coffee,
    "security": ShieldCheck,
    "parking": Car,
    "ac": Snowflake,
    "heating": Thermometer,
    "tv": Television,
    "kitchen": CookingPot,
    "workspace": Desktop,
    "first_aid": FirstAid,
    "fire_extinguisher": FireExtinguisher,
    "pets_allowed": PawPrint,
    // Add more mappings as needed based on your DB values
};

export const getAmenityIcon = (name: string) => {
    // Normalize string: "Hot Shower" -> "hot_shower"
    const key = name.toLowerCase().replace(/\s+/g, "_");
    return AMENITY_ICONS[key] || ShieldCheck; // Default icon
};

export const formatAmenityLabel = (name: string) => {
    return name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
