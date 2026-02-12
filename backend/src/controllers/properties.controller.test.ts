import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertiesController } from '@/controllers/properties.controller';
import { PropertyService } from '@/services/property.service';
import type { Request, Response } from 'express';

// Mock PropertyService
vi.mock('@/services/property.service', () => ({
    PropertyService: {
        getAll: vi.fn(),
        search: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock Redis
vi.mock('@/config/redis', () => ({
    redis: {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
    },
}));

// Mock logging
vi.mock('@/utils/logger', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock catchAsync
vi.mock('@/utils/catchAsync', () => ({
    catchAsync: (fn: any) => async (req: any, res: any, next: any) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    },
}));

describe('PropertiesController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: any;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            // @ts-ignore
            user: { id: 'owner_123' },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('createProperty', () => {
        it('should create a property with whitelisted fields and return 201', async () => {
            req.body = {
                name: 'Test Resort',
                type: 'resort',
                intent: 'short_stay',
                description: 'A cozy place',
                city: 'Kathmandu',
                district: 'Kathmandu',
                address_line: 'Thamel',
                province: 'Bagmati',
                base_price: 1000,
                max_guests: 2,
                amenities: ['wifi'],
                rules: 'no smoking',
                check_in_time: '14:00',
                check_out_time: '11:00',
                units: [],
                images: ['img1.jpg'],

                // Fields that should be ignored/filtered
                status: 'active',
                owner_id: 'other_user',
                randomField: 'hack',
            };

            const expectedSanitizedData = {
                name: 'Test Resort',
                type: 'resort',
                intent: 'short_stay',
                description: 'A cozy place',
                city: 'Kathmandu',
                district: 'Kathmandu',
                address_line: 'Thamel',
                province: 'Bagmati',
                base_price: 1000,
                max_guests: 2,
                amenities: ['wifi'],
                rules: 'no smoking',
                check_in_time: '14:00',
                check_out_time: '11:00',
                units: [],
                images: ['img1.jpg'],
                owner_id: 'owner_123',
            };

            const mockCreatedProperty = { id: 'prop_1', ...expectedSanitizedData };
            (PropertyService.create as any).mockResolvedValue(mockCreatedProperty);

            await PropertiesController.createProperty(req as Request, res as Response, next);

            expect(PropertyService.create).toHaveBeenCalledWith(expectedSanitizedData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { property: mockCreatedProperty },
            });
        });

        it('should handle service errors', async () => {
            req.body = { name: 'Test Property' };
            const error = new Error('DB Error');
            (PropertyService.create as any).mockRejectedValue(error);

            await PropertiesController.createProperty(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
