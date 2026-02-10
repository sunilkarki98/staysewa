import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from '@/middlewares/errorHandler';
import { AppError } from '@/utils/AppError';
import routes from '@/routes';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
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
