import { body, param, query } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Valid phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['CUSTOMER', 'SELLER', 'DELIVERY_PARTNER']),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createProductValidator = [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim(),
];

export const createOrderValidator = [
  body('customerName').trim().notEmpty(),
  body('customerPhone').trim().notEmpty(),
  body('deliveryAddress').trim().notEmpty(),
  body('paymentMethod').isIn(['UPI', 'CARD', 'COD']),
];

export const statusValidator = [
  param('id').isMongoId(),
  body('status').trim().notEmpty(),
];

export const reportQuery = [
  query('range').optional().isIn(['today', 'week', 'month', 'custom']),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
];
