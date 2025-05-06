import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * @desc    Get all products with pagination
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Create query
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Find products that match query
    let query = Product.find(JSON.parse(queryStr) as Record<string, unknown>) as any;
    
    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    
    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Use type assertion to help TypeScript understand this is a Product query
    query = query.skip(skip).limit(limit).populate('category', 'name slug');
    
    // Execute query with explicit type casting to address TypeScript errors
    const products = await query.exec() as unknown as IProduct[];
    
    // Get total count for pagination
    const total = await Product.countDocuments(JSON.parse(queryStr) as Record<string, unknown>) as number;
    
    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid product ID format'));
      return;
    }
    next(error);
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.getFeaturedProducts();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/v1/products/category/:categoryId
 * @access  Public
 */
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    
    const products = await Product.findByCategory(new mongoose.Types.ObjectId(req.params.categoryId));
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
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
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Admin only)
 */
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if referenced category exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      next(new ApiError(400, messages.join(', ')));
      return;
    }
    
    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000 && 'keyValue' in error) {
      const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
      next(new ApiError(400, `Product with this ${field} already exists`));
      return;
    }
    
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if referenced category exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid product ID format'));
      return;
    }
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      next(new ApiError(400, messages.join(', ')));
      return;
    }
    
    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000 && 'keyValue' in error) {
      const field = Object.keys(error.keyValue as Record<string, unknown>)[0];
      next(new ApiError(400, `Product with this ${field} already exists`));
      return;
    }
    
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error instanceof mongoose.Error.CastError) {
      next(new ApiError(400, 'Invalid product ID format'));
      return;
    }
    
    next(error);
  }
};
