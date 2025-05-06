import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and address management
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the current user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      throw new ApiError(404, 'User not found');
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: userProfile._id,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone || '',
        role: userProfile.role,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the current user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    const { firstName, lastName, phone } = req.body;
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(err => {
        const e = err as any;
        return `${e.path}: ${e.msg}`;
      }).join(', ');
      throw new ApiError(400, `Validation error: ${validationErrors}`);
    }
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone || '',
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/addresses:
 *   get:
 *     summary: Get user addresses
 *     description: Retrieves all addresses for the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
export const getUserAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Extract all addresses from the user document
    // This will handle cases where the address array might not exist yet
    const addresses = user.addresses || [];
    
    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/addresses:
 *   post:
 *     summary: Add new address
 *     description: Adds a new address to the current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
export const addUserAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    const { 
      streetAddress: street, // Mappage des propriétés client vers les propriétés serveur
      city, 
      state, 
      postalCode: zipCode, 
      country, 
      isDefault = false,
      type = 'home',
      recipientName,
      additionalInfo,
      phoneNumber,
      deliveryInstructions
    } = req.body;
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(err => {
        const e = err as any;
        return `${e.path}: ${e.msg}`;
      }).join(', ');
      throw new ApiError(400, `Validation error: ${validationErrors}`);
    }
    
    // Create a new address object with a unique ID
    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
      type,
      recipientName,
      additionalInfo,
      phoneNumber,
      deliveryInstructions
    };
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this is set as default, unset any existing default address
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    // Add the new address
    user.addresses.push(newAddress);
    
    // Save the user with the new address
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/addresses/{id}:
 *   put:
 *     summary: Update address
 *     description: Updates an existing address for the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
export const updateUserAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    const addressId = req.params.id;
    const { 
      streetAddress: street, // Mappage des propriétés client vers les propriétés serveur
      city, 
      state, 
      postalCode: zipCode, 
      country, 
      isDefault = false,
      type,
      recipientName,
      additionalInfo,
      phoneNumber,
      deliveryInstructions
    } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Find the address to update
    const addressIndex = user.addresses?.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === undefined || addressIndex === -1 || !user.addresses) {
      throw new ApiError(404, 'Address not found');
    }
    
    // Update address fields
    if (street) user.addresses[addressIndex].street = street;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (zipCode) user.addresses[addressIndex].zipCode = zipCode;
    if (country) user.addresses[addressIndex].country = country;
    
    // Handle default address
    if (isDefault === true) {
      // Unset any existing default address
      user.addresses.forEach((addr, idx) => {
        addr.isDefault = idx === addressIndex;
      });
    }
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     description: Deletes an address from the current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
export const deleteUserAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    const addressId = req.params.id;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user || !user.addresses) {
      throw new ApiError(404, 'User not found');
    }
    
    // Find the address to delete
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      throw new ApiError(404, 'Address not found');
    }
    
    // Check if the address being deleted is the default
    const deletingDefaultAddress = user.addresses[addressIndex].isDefault;
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If we deleted the default address and there are other addresses, make the first one default
    if (deletingDefaultAddress && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/users/addresses/{id}/default:
 *   patch:
 *     summary: Set default address
 *     description: Sets an address as the default for the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;
    const addressId = req.params.id;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user || !user.addresses) {
      throw new ApiError(404, 'User not found');
    }
    
    // Find the address to set as default
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      throw new ApiError(404, 'Address not found');
    }
    
    // Update all addresses, setting isDefault to false except for the selected address
    user.addresses.forEach((addr, idx) => {
      addr.isDefault = idx === addressIndex;
    });
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    next(error);
  }
};
