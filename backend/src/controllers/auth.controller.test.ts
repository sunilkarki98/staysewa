import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '@/controllers/auth.controller';
import { AuthService } from '@/services/auth.service';
import { AppError } from '@/utils/AppError';
import type { Request, Response } from 'express';

// Mock AuthService
vi.mock('@/services/auth.service', () => ({
    AuthService: {
        signup: vi.fn(),
        login: vi.fn(),
        generateToken: vi.fn(() => 'mock_token'),
    },
}));

describe('AuthController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: any;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn(),
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('signup', () => {
        it('should return 400 if fields are missing', async () => {
            req.body = { email: 'test@example.com' }; // Missing password/name

            await AuthController.signup(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].statusCode).toBe(400);
        });

        it('should create user and return token on success', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User',
            };

            const mockUser = { id: 'user_123', email: 'test@example.com' };
            (AuthService.signup as any).mockResolvedValue(mockUser);

            await AuthController.signup(req as Request, res as Response, next);

            expect(AuthService.signup).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com',
            }));
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock_token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                token: 'mock_token',
                data: { user: mockUser },
            }));
        });
    });

    describe('login', () => {
        it('should return 400 if email or password missing', async () => {
            req.body = { email: 'test@example.com' };

            await AuthController.login(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });

        it('should return 401 if login fails', async () => {
            req.body = { email: 'test@example.com', password: 'wrong' };
            (AuthService.login as any).mockResolvedValue(null);

            await AuthController.login(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].statusCode).toBe(401);
        });

        it('should return token on successful login', async () => {
            req.body = { email: 'test@example.com', password: 'correct' };
            const mockUser = { id: 'user_123' };
            (AuthService.login as any).mockResolvedValue(mockUser);

            await AuthController.login(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock_token', expect.any(Object));
        });
    });

    describe('logout', () => {
        it('should clear cookie and return 200', () => {
            AuthController.logout(req as Request, res as Response);

            expect(res.cookie).toHaveBeenCalledWith('jwt', 'loggedout', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
