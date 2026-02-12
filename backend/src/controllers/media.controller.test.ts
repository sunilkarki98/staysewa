import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MediaController } from './media.controller';
import { MediaService } from '@/services/media.service';
import { AppError } from '@/utils/AppError';
import type { Request, Response, NextFunction } from 'express';

// Mock Dependencies
vi.mock('@/services/media.service', () => ({
    MediaService: {
        uploadToSupabase: vi.fn(),
        addMedia: vi.fn(),
    },
}));

// Mock catchAsync to just run the function (since we can't easily mock the wrapper itself)
// But wait, the controller exports the WRAPPED function.
// We need to mock catchAsync implementation OR just await the result if we can't unwrap it.
// In stays.controller.test.ts, I mocked catchAsync global/module?
// No, I mocked it in the test file?
// Let's see stays.controller.test.ts content.

// Copied from stays.controller.test.ts
vi.mock('@/utils/catchAsync', () => ({
    catchAsync: (fn: any) => fn, // Simple pass-through
}));


describe('MediaController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {},
            file: {
                buffer: Buffer.from('fake-image'),
                mimetype: 'image/jpeg',
                originalname: 'test.jpg',
            } as any,
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('uploadMedia', () => {
        it('should upload file and return URL WITHOUT db save if stayId is missing', async () => {
            // Setup
            req.body = {}; // No stayId
            const fakeUrl = 'https://supabase.co/storage/v1/object/public/stays/temp/test.jpg';
            vi.mocked(MediaService.uploadToSupabase).mockResolvedValue(fakeUrl);

            // Execute
            await MediaController.uploadMedia(req as Request, res as Response, next);

            // Verify
            expect(MediaService.uploadToSupabase).toHaveBeenCalled();
            expect(MediaService.addMedia).not.toHaveBeenCalled(); // Critical check!
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: expect.objectContaining({
                    url: fakeUrl,
                    media: { url: fakeUrl }, // Legacy support shape
                }),
            });
        });

        it('should return error if no file and no url provided', async () => {
            req.file = undefined;
            req.body = {};

            await MediaController.uploadMedia(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should save to DB if stayId is provided', async () => {
            req.body = { stayId: 'stay-123' };
            const fakeUrl = 'https://supabase.co/...';
            vi.mocked(MediaService.uploadToSupabase).mockResolvedValue(fakeUrl);
            vi.mocked(MediaService.addMedia).mockResolvedValue({ id: 'media-1', url: fakeUrl } as any);

            await MediaController.uploadMedia(req as Request, res as Response, next);

            expect(MediaService.addMedia).toHaveBeenCalledWith(expect.objectContaining({
                stayId: 'stay-123',
                url: fakeUrl,
            }));
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
