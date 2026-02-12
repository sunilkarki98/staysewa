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

// Support multiple CORS origins and Vercel preview deployments
const allowedOrigins = env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // 1. Allow if no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);

        // 2. Allow if in explicit whitelist
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }

        // 3. Allow Vercel preview deployments
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // 4. Fallback: Reject
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

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
