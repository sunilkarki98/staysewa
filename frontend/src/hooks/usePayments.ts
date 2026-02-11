import { useState } from "react";
import { PaymentsService } from "../services/domain";
import type { PaymentInitResponse, PaymentVerifyResponse } from "../services/domain";
import type { ApiError } from "../api/types";

export function usePayments() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const initiatePayment = async (
        bookingId: string,
        amount: number
    ): Promise<PaymentInitResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await PaymentsService.initiate(bookingId, amount);
            return result;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (
        pidx: string
    ): Promise<PaymentVerifyResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await PaymentsService.verify(pidx);
            return result;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { initiatePayment, verifyPayment, loading, error };
}
