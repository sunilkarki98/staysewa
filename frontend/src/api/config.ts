export const API_CONFIG = {
    BASE_URL: "http://localhost:4000/api",
    TIMEOUT: 10000,
    MOCK_ENABLED: false, // Switch to real backend
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/auth/login",
            REGISTER: "/auth/register",
            ME: "/auth/me",
        },
        STAYS: {
            LIST: "/stays",
            DETAILS: (id: string) => `/stays/${id}`,
            CREATE: "/stays",
            UPDATE: (id: string) => `/stays/${id}`,
            DELETE: (id: string) => `/stays/${id}`,
        },
        BOOKINGS: {
            LIST: "/bookings",
            DETAILS: (id: string) => `/bookings/${id}`,
            UPDATE_STATUS: (id: string) => `/bookings/${id}/status`,
        },
        USERS: {
            PROFILE: "/users/profile",
        },
        DASHBOARD: {
            STATS: "/dashboard/stats",
        },
    },
};
