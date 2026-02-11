export type UserRole = "guest" | "owner" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
}

export interface AuthResponse {
    status: string;
    data: {
        user: User;
    };
}
