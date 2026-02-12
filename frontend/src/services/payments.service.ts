import { apiClient } from "../api/client";
import { API_CONFIG } from "../api/config";
import type { BackendResponse } from "../api/types";

export interface PaymentInitResponse {
    paymentUrl: string;
    pidx: string;
}

export interface PaymentVerifyResponse {
    status: string;
    transactionId: string;
}

export const PaymentsService = {
    initiate: async (bookingId: string, amount: number): Promise<PaymentInitResponse> => {
        const response = await apiClient.post<BackendResponse<PaymentInitResponse>>(
            API_CONFIG.ENDPOINTS.PAYMENTS.INITIATE,
            { bookingId, amount }
        );
        return response.data;
    },

    verify: async (pidx: string): Promise<PaymentVerifyResponse> => {
        const response = await apiClient.post<BackendResponse<PaymentVerifyResponse>>(
            API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY,
            { pidx }
        );
        return response.data;
    },
};
