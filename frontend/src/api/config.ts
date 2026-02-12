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
        PROPERTIES: {
            LIST: "/properties",
            DETAILS: (id: string) => `/properties/${id}`,
            CREATE: "/properties",
            UPDATE: (id: string) => `/properties/${id}`,
            DELETE: (id: string) => `/properties/${id}`,
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
        REVIEWS: {
            CREATE: "/reviews",
            BY_PROPERTY: (id: string) => `/properties/${id}/reviews`,
        },
        MEDIA: {
            UPLOAD: "/media",
            DELETE: (id: string) => `/media/${id}`,
            SET_COVER: (id: string) => `/media/${id}/cover`,
            BY_PROPERTY: (propertyId: string) => `/media/properties/${propertyId}`,
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
            ACTIVITY: "/admin/activity",
            OWNERS: "/admin/owners",
            PROPERTIES: "/admin/properties",
            VERIFY_OWNER: (id: string) => `/admin/owners/${id}/verify`,
            BAN_OWNER: (id: string) => `/admin/owners/${id}/ban`,
            BAN_USER: (id: string) => `/admin/users/${id}/ban`, // keeping both for safety if needed
            BOOKINGS: "/admin/bookings",
        },
    },
};
