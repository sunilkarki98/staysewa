import { API_CONFIG } from "./config";
import type { ApiError } from "./types";
import { supabase } from "../lib/supabase";

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        const headers: Record<string, string> = {};

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }
        } catch {
            // Auth not available — proceed without token
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const { params, ...customConfig } = config;

        const authHeaders = await this.getAuthHeaders();

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...authHeaders,
            ...(customConfig.headers as Record<string, string>),
        };

        // Build URL with query params
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value);
                }
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(url.toString(), {
                ...customConfig,
                headers,
                signal: controller.signal,
                credentials: "include", // Send cookies for JWT
            });

            clearTimeout(timeoutId);

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
            clearTimeout(timeoutId);

            if (error instanceof DOMException && error.name === "AbortError") {
                throw {
                    message: "Request timed out. Please try again.",
                    status: 408,
                } as ApiError;
            }

            if (error instanceof TypeError) {
                throw {
                    message: "Network error. Please check your connection.",
                    status: 0,
                } as ApiError;
            }

            throw error as ApiError;
        }
    }

    public get<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: "GET" });
    }

    public post<T>(endpoint: string, body: unknown, config?: RequestConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    public put<T>(endpoint: string, body: unknown, config?: RequestConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    public patch<T>(endpoint: string, body: unknown, config?: RequestConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }

    public delete<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: "DELETE" });
    }

    /**
     * Upload files via multipart/form-data.
     * Does NOT set Content-Type — browser sets it with boundary automatically.
     */
    public async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        const authHeaders = await this.getAuthHeaders();
        const url = `${this.baseUrl}${endpoint}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT * 3);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: authHeaders, // No Content-Type — browser handles multipart boundary
                body: formData,
                signal: controller.signal,
                credentials: "include",
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || "Upload failed",
                    status: response.status,
                    errors: data.errors,
                } as ApiError;
            }

            return data as T;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof DOMException && error.name === "AbortError") {
                throw { message: "Upload timed out.", status: 408 } as ApiError;
            }
            if (error instanceof TypeError) {
                throw { message: "Network error during upload.", status: 0 } as ApiError;
            }
            throw error as ApiError;
        }
    }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
