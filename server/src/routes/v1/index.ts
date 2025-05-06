import express from 'express';
import healthRoutes from '../healthRoutes';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';
import { ApiError } from '../../middleware/errorHandler';

const router = express.Router();

/**
 * API v1 Routes
 * All v1 specific routes should be registered here
 */

// Health check endpoint
router.use('/health', healthRoutes);

// Base route
router.get('/', (req, res) => {
  res.json({
    message: 'Sushi Shop API - v1',
    version: 'v1',
    endpoints: {
      health: `${req.protocol}://${req.get('host')}/api/v1/health`,
      auth: `${req.protocol}://${req.get('host')}/api/v1/auth`,
      categories: `${req.protocol}://${req.get('host')}/api/v1/categories`,
      products: `${req.protocol}://${req.get('host')}/api/v1/products`
    },
    documentation: `${req.protocol}://${req.get('host')}/api/docs`
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);

// Handle 404 for v1 routes - use a standard Express 404 handler at the end of the router chain
router.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

export default router;
