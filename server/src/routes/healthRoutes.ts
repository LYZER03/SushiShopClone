import express from 'express';
import { getHealthStatus, getDetailedHealth } from '../controllers/healthController';

const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint to verify API is running
 * @access  Public
 */
router.get('/', getHealthStatus);

/**
 * @route   GET /api/v1/health/details
 * @desc    Detailed health check with DB connection status and system info
 * @access  Public
 */
router.get('/details', getDetailedHealth);

export default router;
