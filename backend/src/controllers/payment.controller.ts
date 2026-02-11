import type { Request, Response } from 'express';
import { PaymentService } from '@/services/payment.service';
import { catchAsync } from '@/utils/catchAsync';

export const PaymentController = {
    /**
     * Initiate payment
     */
    initiate: catchAsync(async (req: Request, res: Response) => {
        const { bookingId, amount } = req.body;
        const result = await PaymentService.initiateKhalti(bookingId, amount);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    }),

    /**
     * Verify payment
     */
    verify: catchAsync(async (req: Request, res: Response) => {
        const { pidx } = req.body;
        const result = await PaymentService.verifyKhalti(pidx);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    }),

    /**
     * Handle Webhook
     */
    webhook: catchAsync(async (req: Request, res: Response) => {
        const result = await PaymentService.handleKhaltiWebhook(req.body);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    }),
};
