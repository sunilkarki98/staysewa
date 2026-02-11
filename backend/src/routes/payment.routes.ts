import { Router } from 'express';
import { PaymentController } from '@/controllers/payment.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { paymentSchema } from '@/validations/payment.schema';

const router = Router();

// Public Webhook (Secured via signature or IP if needed, but here public for gateway)
router.post('/webhook/khalti', PaymentController.webhook);

// Protected payment routes
router.use(protect);

router.post('/initiate', validate(paymentSchema.initiate), PaymentController.initiate);
router.post('/verify', validate(paymentSchema.verify), PaymentController.verify);

export default router;
