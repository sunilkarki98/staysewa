import { API_CONFIG } from "./config";
import { ApiError, ApiResponse } from "./types";

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const { params, ...customConfig } = config;
        const headers = {
            "Content-Type": "application/json",
            ...customConfig.headers,
        };

        // Build URL with query params
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.append(key, value);
            });
        }

        try {
            const response = await fetch(url.toString(), {
                ...customConfig,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || "Something went wrong",
                    status: response.status,
                    errors: data.errors,
                } as ApiError;
            }

            return data as T;
        } catch (error) {
            // Network errors or JSON parsing errors
            if (error instanceof TypeError) {
                throw {
                    message: "Network Error: Please check your internet connection.",
                    status: 0
                } as ApiError;
            }
            throw error as ApiError;
        }
    }

    public get<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: "GET" });
    }

    public post<T>(endpoint: string, body: any, config?: RequestConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    public put<T>(endpoint: string, body: any, config?: RequestConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    public delete<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: "DELETE" });
    }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
