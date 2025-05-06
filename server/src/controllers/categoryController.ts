import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ active: true }).sort({ sortOrder: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid category ID format'));
      return;
    }
    next(error);
  }
};

/**
 * @desc    Get category by slug
 * @route   GET /api/v1/categories/slug/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, active: true });
    
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private (Admin only)
 */
export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, imageUrl, active, sortOrder } = req.body;
    
    const category = await Category.create({
      name,
      description,
      imageUrl,
      active,
      sortOrder
      // slug will be auto-generated in pre-save hook
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      next(new ApiError(400, messages.join(', ')));
      return;
    }
    
    // Handle duplicate key error (e.g., duplicate name or slug)
    if (error instanceof Error && 'code' in error && error.code === 11000 && 'keyValue' in error) {
      const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
      next(new ApiError(400, `Category with this ${field} already exists`));
      return;
    }
    next(error);
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/v1/categories/:id
 * @access  Private (Admin only)
 */
export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, slug, imageUrl, active, sortOrder } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      { name, description, slug, imageUrl, active, sortOrder },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid category ID format'));
      return;
    }
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      next(new ApiError(400, messages.join(', ')));
      return;
    }
    
    // Handle duplicate key error
    if (error instanceof Error && 'code' in error && error.code === 11000 && 'keyValue' in error) {
      const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
      next(new ApiError(400, `Category with this ${field} already exists`));
      return;
    }
    
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private (Admin only)
 */
export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid category ID format'));
      return;
    }
    
    next(error);
  }
};
