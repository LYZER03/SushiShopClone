import { connectDatabase, closeDatabase } from '../config/database';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * Test MongoDB connection and model operations
 * This script can be run independently to verify database connectivity
 * @param closeOnComplete - Whether to close the database connection after tests. Default is false.
 */
const testDatabaseConnection = async (closeOnComplete: boolean = false): Promise<void> => {
  try {
    // Connect to the database (this is a no-op if already connected)
    const connection = await connectDatabase();
    
    // Test database operations
    await testProductModel();
    
    // Only close the connection if explicitly requested or if running as standalone script
    if (closeOnComplete) {
      await closeDatabase();
    }
    
    logger.info('Database connectivity tests passed successfully');
  } catch (error) {
    logger.error(`Database test failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error; // Re-throw to allow proper handling
  }
};

/**
 * Test the Product model CRUD operations
 */
const testProductModel = async (): Promise<void> => {
  try {
    // First create a test category
    const testCategory = await Category.create({
      name: 'Rolls',
      description: 'Various sushi rolls',
      active: true,
      sortOrder: 1
    });
    
    logger.info(`Created test category: ${testCategory.name} with ID: ${testCategory._id}`);
    
    // Create a test product with a reference to the category
    const testProduct = {
      name: 'California Roll',
      description: 'A delicious sushi roll with crab, avocado, and cucumber',
      price: 8.99,
      category: testCategory._id, // Using the Category ObjectId
      ingredients: ['crab', 'avocado', 'cucumber', 'rice', 'nori'],
      allergens: ['shellfish'],
      isVegetarian: false,
      isGlutenFree: false,
      nutrition: {
        calories: 250,
        protein: 7,
        carbs: 38,
        fat: 7
      },
      rating: 4.5
    };
    
    // Clear any existing test data
    await Product.deleteMany({ name: testProduct.name });
    
    // Create new product
    const newProduct = new Product(testProduct);
    const savedProduct = await newProduct.save();
    logger.info(`Test product created with ID: ${savedProduct._id}`);
    
    // Find the product
    const foundProduct = await Product.findById(savedProduct._id);
    if (foundProduct) {
      logger.info(`Created test product: ${savedProduct.name} with ID: ${savedProduct._id}`);
    }
    
    // Read the product back with the populated category
    const retrievedProduct = await Product.findById(savedProduct._id).populate('category');
    logger.info(`Retrieved test product: ${retrievedProduct?.name}`);
    logger.info(`With category: ${(retrievedProduct?.category as any)?.name}`);
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      savedProduct._id,
      { price: 9.99 },
      { new: true }
    );
    logger.info(`Updated test product price to: $${updatedProduct?.price}`);
    
    // Delete the product
    await Product.findByIdAndDelete(savedProduct._id);
    logger.info('Deleted test product');
    
    // Delete the category after we're done with the product
    await Category.findByIdAndDelete(testCategory._id);
    logger.info('Deleted test category');
  } catch (error) {
    logger.error(`Product model test failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// If this script is run directly (not imported)
if (require.main === module) {
  testDatabaseConnection()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

export { testDatabaseConnection };
