import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingsController } from '@/controllers/bookings.controller';
import { BookingsService } from '@/services/booking.service';
import { AppError } from '@/utils/AppError';
import type { Request, Response } from 'express';

// Mock BookingsService
vi.mock('@/services/booking.service', () => ({
    BookingsService: {
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        transitionStatus: vi.fn(),
    },
}));

describe('BookingsController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: any;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('getAllBookings', () => {
        it('should return all bookings', async () => {
            const mockBookings = [{ id: '1' }, { id: '2' }];
            (BookingsService.getAll as any).mockResolvedValue(mockBookings);

            await BookingsController.getAllBookings(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                results: 2,
                data: { bookings: mockBookings },
            }));
        });
    });

    describe('getBooking', () => {
        it('should return 400 if ID is missing', async () => {
            await BookingsController.getBooking(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should return 404 if booking not found', async () => {
            req.params = { id: 'invalid_id' };
            (BookingsService.getById as any).mockResolvedValue(null);

            await BookingsController.getBooking(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].statusCode).toBe(404);
        });

        it('should return booking if found', async () => {
            req.params = { id: 'valid_id' };
            const mockBooking = { id: 'valid_id' };
            (BookingsService.getById as any).mockResolvedValue(mockBooking);

            await BookingsController.getBooking(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: { booking: mockBooking },
            }));
        });
    });

    describe('createBooking', () => {
        it('should create booking and return 201', async () => {
            req.body = { unitId: 'unit_1', checkIn: '2023-01-01', checkOut: '2023-01-05' };
            const mockBooking = { id: 'book_1', ...req.body };
            (BookingsService.create as any).mockResolvedValue(mockBooking);

            await BookingsController.createBooking(req as Request, res as Response, next);

            expect(BookingsService.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: { booking: mockBooking },
            }));
        });
    });

    describe('updateBookingStatus', () => {
        it('should return 400 if status is missing', async () => {
            req.params = { id: 'book_1' };
            await BookingsController.updateBookingStatus(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should return 404 if booking not found', async () => {
            req.params = { id: 'book_1' };
            req.body = { status: 'confirmed' };
            (BookingsService.transitionStatus as any).mockResolvedValue(null);

            await BookingsController.updateBookingStatus(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].statusCode).toBe(404);
        });

        it('should return updated booking', async () => {
            req.params = { id: 'book_1' };
            req.body = { status: 'confirmed' };
            const mockBooking = { id: 'book_1', status: 'confirmed' };
            (BookingsService.transitionStatus as any).mockResolvedValue(mockBooking);

            await BookingsController.updateBookingStatus(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: { booking: mockBooking },
            }));
        });
    });
});
