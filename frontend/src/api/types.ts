export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    errors?: Record<string, string[]>; // Validation errors
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface BackendResponse<T> {
    status: string;
    data: T;
    results?: number;
}
