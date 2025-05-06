import express, { Request, Response, NextFunction } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  refreshToken, 
  forgotPassword, 
  resetPassword,
  changePassword
} from '../../controllers/authController';
import { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation,
  changePasswordValidation
} from '../../middleware/validators';
import { authenticate, AuthRequest, createHandler, createAuthMiddleware } from '../../middleware/auth';
import { RequestHandler } from 'express';
import { authLimiter } from '../../middleware/rateLimiter';

const router = express.Router();

/**
 * Public authentication routes
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, registerValidation, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, login);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, resetPassword);

/**
 * Protected authentication routes
 * All routes below this require authentication
 */

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
// We're using the createHandler function imported from auth middleware

router.get('/me', authenticate as unknown as RequestHandler, createHandler(getProfile));

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh-token', authenticate as unknown as RequestHandler, createHandler(refreshToken));

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/change-password', authenticate as unknown as RequestHandler, changePasswordValidation, createHandler(changePassword));

export default router;
