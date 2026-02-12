import type { Request, Response, NextFunction } from 'express';
import { PropertyService } from '@/services/property.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { redis } from '@/config/redis';
import { logger } from '@/utils/logger';

/**
 * Properties Controller - Modular SaaS pattern
 */
export const PropertiesController = {

    /**
     * Get all properties
     */
    getAllProperties: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        logger.debug('API: Fetching all properties - start');

        const cacheKey = 'properties:all';

        if (redis) {
            try {
                logger.debug('API: Checking Redis cache...');
                const cachedProperties = await redis.get(cacheKey);
                if (cachedProperties) {
                    logger.debug('API: Cache hit! Returning properties.');
                    const properties = JSON.parse(cachedProperties);
                    return res.status(200).json({
                        status: 'success',
                        results: properties.length,
                        data: { properties },
                    });
                }
                logger.debug('API: Cache miss.');
            } catch (err) {
                logger.error(err, 'API: Redis error during fetch');
            }
        }

        const filters = {
            location: req.query.location as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            type: req.query.category as string,
            guests: req.query.guests ? Number(req.query.guests) : undefined,
            checkIn: req.query.checkIn as string,
            checkOut: req.query.checkOut as string,
        };

        const properties = await PropertyService.search(filters);

        if (redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(properties), 'EX', 300);
            } catch (err) {
                logger.error(err, 'API: Redis set error');
            }
        }

        res.status(200).json({
            status: 'success',
            results: properties.length,
            data: { properties },
        });
    }),

    /**
     * Get a single property by ID
     */
    getProperty: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const property = await PropertyService.getById(id as string);

        if (!property) {
            return next(new AppError('No property found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { property },
        });
    }),

    /**
     * Create a new property
     */
    createProperty: catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
        const owner_id = (req as any).user?.id;

        const allowedFields = [
            'name', 'type', 'description',
            'city', 'district', 'address_line', 'province',
            'base_price', 'max_guests', 'bedrooms', 'bathrooms',
            'amenities', 'rules', 'check_in_time', 'check_out_time',
            'units', 'images',
        ] as const;

        const safeData: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                safeData[field] = req.body[field];
            }
        }

        const newProperty = await PropertyService.create({
            ...safeData,
            owner_id: owner_id || req.body.owner_id,
        } as any);

        if (redis) {
            await redis.del('properties:all');
        }

        res.status(201).json({
            status: 'success',
            data: { property: newProperty },
        });
    }),

    /**
     * Update an existing property
     */
    updateProperty: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const allowedFields = [
            'name', 'type', 'description',
            'city', 'district', 'address_line', 'province',
            'base_price', 'max_guests', 'bedrooms', 'bathrooms',
            'amenities', 'rules', 'check_in_time', 'check_out_time',
        ] as const;

        const safeData: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                safeData[field] = req.body[field];
            }
        }

        const updatedProperty = await PropertyService.update(id as string, safeData);

        if (!updatedProperty) {
            return next(new AppError('No property found with that ID', 404));
        }

        if (redis) {
            await redis.del('properties:all');
        }

        res.status(200).json({
            status: 'success',
            data: { property: updatedProperty },
        });
    }),

    /**
     * Delete a property
     */
    deleteProperty: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deletedProperty = await PropertyService.delete(id as string);

        if (!deletedProperty) {
            return next(new AppError('No property found with that ID', 404));
        }

        if (redis) {
            await redis.del('properties:all');
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    }),
};
