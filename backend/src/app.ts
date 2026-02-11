import express from 'express';
import { env } from '@/config/env';

import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from '@/middlewares/errorHandler';
import { AppError } from '@/utils/AppError';
import routes from '@/routes';
import { rateLimit } from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Global Middlewares
app.use(helmet());
app.use(limiter);
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'success', message: 'StaySewa API is healthy' });
});

app.use('/api', routes);

// 404 Handler
app.use((req, _res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
