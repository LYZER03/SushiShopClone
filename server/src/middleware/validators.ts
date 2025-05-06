import { Request, Response, NextFunction } from 'express';
import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Validation chains for user registration
 */
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

/**
 * Validation chains for user login
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation chains for password reset request
 */
export const forgotPasswordValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

/**
 * Validation chains for password reset
 */
export const resetPasswordValidation: ValidationChain[] = [
  param('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
];

/**
 * Validation chains for password change
 */
export const changePasswordValidation: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
];

/**
 * Validation chains for category operations
 */
export const categoryValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL for the image'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a positive integer')
];

/**
 * Validation chains for product operations
 */
export const productValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL for the image'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('ingredients.*')
    .optional()
    .isString()
    .withMessage('Each ingredient must be a string'),
  
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  
  body('allergens.*')
    .optional()
    .isString()
    .withMessage('Each allergen must be a string'),
  
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean value'),
  
  body('isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean value'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean value'),
  
  body('nutrition')
    .optional()
    .isObject()
    .withMessage('Nutrition must be an object'),
  
  body('nutrition.calories')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories must be a positive integer'),
  
  body('nutrition.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein must be a positive number'),
  
  body('nutrition.carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbs must be a positive number'),
  
  body('nutrition.fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fat must be a positive number'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be a number between 0 and 5'),
  
  body('numReviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of reviews must be a positive integer')
];

/**
 * Validation chains for user profile update
 */
export const profileUpdateValidation: ValidationChain[] = [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty if provided')
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty if provided')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

/**
 * Validation chains for address operations
 */
export const addressValidation: ValidationChain[] = [
  body('streetAddress')
    .notEmpty()
    .withMessage('Street address is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Street address cannot exceed 100 characters'),
  
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
  
  body('state')
    .optional() // Rendre le champ state optionnel pour correspondre à l'interface client
    .trim()
    .isLength({ max: 50 })
    .withMessage('State/Province cannot exceed 50 characters'),
  
  body('postalCode')
    .notEmpty()
    .withMessage('Postal code is required')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Postal code cannot exceed 20 characters'),
  
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Address type is required')
    .isIn(['home', 'work', 'other'])
    .withMessage('Type must be one of: home, work, other'),

  body('recipientName')
    .notEmpty()
    .withMessage('Recipient name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Recipient name cannot exceed 100 characters'),

  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('additionalInfo')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Additional info cannot exceed 200 characters'),
  
  body('deliveryInstructions')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Delivery instructions cannot exceed 200 characters'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value')
];
