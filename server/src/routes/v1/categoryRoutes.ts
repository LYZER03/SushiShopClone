import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../controllers/categoryController';
import { authenticate, authorize, createHandler, createAuthMiddleware, AuthRequest } from '../../middleware/auth';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../../models/User';
import { categoryValidation } from '../../middleware/validators';

const router = express.Router();

// Define routes in order of specificity (most specific first, params last)

/**
 * @route   GET /api/v1/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
router.get('/slug/:slug', getCategoryBySlug);

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
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
  categoryValidation, 
  createHandler(createCategory)
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category
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
  categoryValidation, 
  createHandler(updateCategory)
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
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
  createHandler(deleteCategory)
);

export default router;
