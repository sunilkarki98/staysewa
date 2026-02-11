export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    TIMEOUT: 10000,
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/auth/login",
            REGISTER: "/auth/signup",
            ME: "/auth/me",
            LOGOUT: "/auth/logout",
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
            CREATE: "/bookings",
            MY: "/bookings/my",
            DETAILS: (id: string) => `/bookings/${id}`,
            UPDATE_STATUS: (id: string) => `/bookings/${id}/status`,
        },
        USERS: {
            PROFILE: "/users/profile",
            LIST: "/users",
        },
        DASHBOARD: {
            STATS: "/owner/dashboard/stats",
            ACTIVITY: "/owner/dashboard/activity",
        },
        PAYMENTS: {
            INITIATE: "/payments/initiate",
            VERIFY: "/payments/verify",
        },
        MEDIA: {
            UPLOAD: "/media",
            DELETE: (id: string) => `/media/${id}`,
            SET_COVER: (id: string) => `/media/${id}/cover`,
            BY_STAY: (stayId: string) => `/media/stays/${stayId}`,
            BY_UNIT: (unitId: string) => `/media/units/${unitId}`,
        },
        OWNERS: {
            LIST: "/owners",
            DETAILS: (id: string) => `/owners/${id}`,
        },
        CUSTOMERS: {
            LIST: "/customers",
            DETAILS: (id: string) => `/customers/${id}`,
        },
        ADMIN: {
            STATS: "/admin/stats",
        },
    },
};
