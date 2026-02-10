import { useState, useCallback } from "react";
import { ApiError } from "../api/types";

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
}

export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
    const [status, setStatus] = useState<AsyncState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const execute = useCallback(async () => {
        setStatus({ data: null, loading: true, error: null });

        try {
            const response = await asyncFunction();
            setStatus({ data: response, loading: false, error: null });
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            setStatus({ data: null, loading: false, error: apiError });
            throw apiError;
        }
    }, [asyncFunction]);

    // Execute immediately if requested
    // Note: For real effect, this should be combined with useEffect in the consuming hook

    return { execute, ...status };
}
