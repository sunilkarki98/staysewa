import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Validation Middleware
 * Wraps a Zod schema and validates the request body, query, or params.
 */
export const validate = (schema: z.ZodObject<any>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues
                    .map((err) => `${err.path.join('.')}: ${err.message}`)
                    .join(', ');
                return next(new AppError(message, 400));
            }
            return next(error);
        }
    });
