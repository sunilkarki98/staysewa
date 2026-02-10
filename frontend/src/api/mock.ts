import { MOCK_STAYS } from "@/data/stays";
import { Stay } from "@/types/stay";
import { hostels } from "@/data/hostels";
import { MOCK_BOOKINGS } from "@/data/bookings";

// Combine all stay data sources
const ALL_STAYS = [...MOCK_STAYS, ...hostels];

export const MockAdapter = {
    async get<T>(endpoint: string): Promise<T> {
        console.log(`[MockAdapter] GET ${endpoint}`);
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

        if (endpoint === "/stays") {
            return ALL_STAYS as unknown as T;
        }

        if (endpoint.startsWith("/stays/")) {
            const id = endpoint.split("/").pop();
            const stay = ALL_STAYS.find((s) => s.id === id);
            if (!stay) throw new Error("Stay not found");
            return stay as unknown as T;
        }

        if (endpoint === "/dashboard/stats") {
            return [
                { title: "Total Revenue", value: "NPR 1,25,000", change: "+12.5%", trend: "up" },
                { title: "Active Stays", value: "24", change: "+2", trend: "up" },
                { title: "Pending Bookings", value: "8", change: "-1", trend: "down" },
                { title: "Profile Views", value: "1,432", change: "+5.3%", trend: "up" },
            ] as unknown as T;
        }

        if (endpoint === "/bookings") {
            return MOCK_BOOKINGS as unknown as T;
        }

        throw new Error(`Mock endpoint not found: ${endpoint}`);
    },

    async post<T>(endpoint: string, data: any): Promise<T> {
        console.log(`[MockAdapter] POST ${endpoint}`, data);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Handle booking status update via POST
        if (endpoint.startsWith("/bookings/") && endpoint.endsWith("/status")) {
            const parts = endpoint.split("/");
            const id = parts[parts.length - 2];
            const booking = MOCK_BOOKINGS.find(b => b.id === id);
            if (booking && data.status) {
                booking.status = data.status;
            }
            return booking as unknown as T;
        }

        return data as T;
    },

    async put<T>(endpoint: string, data: any): Promise<T> {
        console.log(`[MockAdapter] PUT ${endpoint}`, data);
        await new Promise((resolve) => setTimeout(resolve, 800));
        // For status updates, we handled logic in get/post but strictly REST uses PUT/PATCH
        // Let's support PUT for status updates if the service uses it
        return data as T;
    },

    async delete(endpoint: string): Promise<void> {
        console.log(`[MockAdapter] DELETE ${endpoint}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
    },
};
