import type { Request, Response, NextFunction } from 'express';
import { CustomersService } from '@/services/customer.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

/**
 * Customers Controller - Modular SaaS pattern
 */
export const CustomersController = {
    /**
     * Get all customers
     */
    getAllCustomers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const customers = await CustomersService.getAll();
        res.status(200).json({
            status: 'success',
            results: customers.length,
            data: { customers },
        });
    }),

    /**
     * Get a single customer
     */
    getCustomer: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) {
            return next(new AppError('Customer ID is required', 400));
        }

        const customer = await CustomersService.getById(id as string);

        if (!customer) {
            return next(new AppError('No customer found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { customer },
        });
    }),

    /**
     * Create a new customer
     */
    createCustomer: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        if (!email) {
            return next(new AppError('Email is required', 400));
        }

        const existingCustomer = await CustomersService.getByEmail(email);
        if (existingCustomer) {
            return next(new AppError('Customer with this email already exists', 400));
        }

        const newCustomer = await CustomersService.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { customer: newCustomer },
        });
    }),
};
