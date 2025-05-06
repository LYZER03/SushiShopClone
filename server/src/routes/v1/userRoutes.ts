import express from 'express';
import { authenticate } from '../../middleware/auth';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress 
} from '../../controllers/userController';
import { profileUpdateValidation, addressValidation } from '../../middleware/validators';

const router = express.Router();

/**
 * User Routes
 * All routes require authentication
 */

/**
 * @swagger
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * @swagger
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, profileUpdateValidation, updateUserProfile);

/**
 * @swagger
 * @route   GET /api/v1/users/addresses
 * @desc    Get user addresses
 * @access  Private
 */
router.get('/addresses', authenticate, getUserAddresses);

/**
 * @swagger
 * @route   POST /api/v1/users/addresses
 * @desc    Add new address
 * @access  Private
 */
router.post('/addresses', authenticate, addressValidation, addUserAddress);

/**
 * @swagger
 * @route   PUT /api/v1/users/addresses/:id
 * @desc    Update address
 * @access  Private
 */
router.put('/addresses/:id', authenticate, addressValidation, updateUserAddress);

/**
 * @swagger
 * @route   DELETE /api/v1/users/addresses/:id
 * @desc    Delete address
 * @access  Private
 */
router.delete('/addresses/:id', authenticate, deleteUserAddress);

/**
 * @swagger
 * @route   PATCH /api/v1/users/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
router.patch('/addresses/:id/default', authenticate, setDefaultAddress);

export default router;
