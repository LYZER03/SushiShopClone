import express from 'express';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/productController';
import { authenticate, authorize, createHandler, createAuthMiddleware, AuthRequest } from '../../middleware/auth';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../../models/User';
import { productValidation } from '../../middleware/validators';

const router = express.Router();

// Define routes in order of specificity (most specific first, params last)

/**
 * @route   GET /api/v1/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', getFeaturedProducts);

/**
 * @route   GET /api/v1/products/category/:categoryId
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:categoryId', getProductsByCategory);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with pagination, sorting, and filtering
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post(
  '/', 
  authenticate as unknown as RequestHandler, 
  (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || authReq.user.role !== UserRole.ADMIN) {
      return next(new Error('Not authorized as admin'));
    }
    next();
  },
  productValidation, 
  createHandler(createProduct)
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
router.put(
  '/:id', 
  authenticate as unknown as RequestHandler, 
  (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || authReq.user.role !== UserRole.ADMIN) {
      return next(new Error('Not authorized as admin'));
    }
    next();
  },
  productValidation, 
  createHandler(updateProduct)
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product
 * @access  Private (Admin only)
 */
router.delete(
  '/:id', 
  authenticate as unknown as RequestHandler, 
  (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || authReq.user.role !== UserRole.ADMIN) {
      return next(new Error('Not authorized as admin'));
    }
    next();
  },
  createHandler(deleteProduct)
);

export default router;
