import { Router } from 'express';
import { CustomersController } from '@/controllers/customers.controller';

const router = Router();

/**
 * Customers Routes - Production ready setup
 */
router.get('/', CustomersController.getAllCustomers);
router.get('/:id', CustomersController.getCustomer);
router.post('/', CustomersController.createCustomer);

export default router;
