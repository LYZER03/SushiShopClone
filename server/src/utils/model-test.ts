import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import '../models/User';
import '../models/Category';
import '../models/Product';
import { UserRole } from '../models/User';

// Load environment variables
dotenv.config();

// Generate unique names using timestamps to avoid duplicate key errors
const timestamp = Date.now();
const uniqueCategoryName = `Test Category ${timestamp}`;
const uniqueProductName = `Test Sushi Roll ${timestamp}`;

// Test data
let categoryId: string;
let productId: string;

/**
 * Test the Mongoose models directly
 */
async function testModels(): Promise<void> {
  try {
    logger.info('🧪 Starting Mongoose model test...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi-shop';
    await mongoose.connect(mongoUri);
    logger.info('✅ Connected to MongoDB successfully');

    // Get model references
    const User = mongoose.model('User');
    const Category = mongoose.model('Category');
    const Product = mongoose.model('Product');

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@test.com',
        password: 'Test1234!',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      });
      logger.info('✅ Created test admin user');
    } else {
      logger.info('✅ Found existing test admin user');
    }

    // 1. Test Category Model
    logger.info('1️⃣ Testing Category Model...');
    
    // Create category
    const category = await Category.create({
      name: uniqueCategoryName,
      description: 'This is a test category',
      active: true,
      sortOrder: 10
    });
    
    categoryId = category._id.toString();
    logger.info(`✅ Created test category with ID: ${categoryId}`);
    logger.info(`✅ Category name: ${category.name}`);
    logger.info(`✅ Category slug: ${category.slug}`);
    
    // Get all categories
    const categories = await Category.find();
    logger.info(`✅ Retrieved all categories (${categories.length} found)`);
    
    // Get category by ID
    const categoryById = await Category.findById(categoryId);
    if (categoryById) {
      logger.info(`✅ Retrieved category by ID: ${categoryById.name}`);
    }
    
    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: `Updated ${uniqueCategoryName}`,
        description: 'This category has been updated'
      },
      { new: true }
    );
    
    if (updatedCategory) {
      logger.info(`✅ Updated category to: ${updatedCategory.name}`);
    }

    // 2. Test Product Model
    logger.info('2️⃣ Testing Product Model...');
    
    // Create product
    const product = await Product.create({
      name: uniqueProductName,
      description: 'Delicious test sushi roll',
      price: 12.99,
      category: categoryId,
      featured: true,
      ingredients: ['rice', 'nori', 'salmon', 'avocado'],
      allergens: ['fish', 'soy'],
      isVegetarian: false,
      isGlutenFree: true,
      nutrition: {
        calories: 320,
        protein: 15,
        carbs: 40,
        fat: 10
      }
    });
    
    productId = product._id.toString();
    logger.info(`✅ Created test product with ID: ${productId}`);
    
    // Get all products
    const products = await Product.find();
    logger.info(`✅ Retrieved all products (${products.length} found)`);
    
    // Get product by ID with category populated
    const productWithCategory = await Product.findById(productId).populate('category');
    
    if (productWithCategory) {
      logger.info(`✅ Retrieved product by ID: ${productWithCategory.name}`);
      // Check category population
      const populatedCategory = productWithCategory.category as any;
      if (populatedCategory && populatedCategory.name) {
        logger.info(`✅ Successfully populated category: ${populatedCategory.name}`);
      }
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: `Updated ${uniqueProductName}`,
        price: 14.99,
        inStock: true
      },
      { new: true }
    );
    
    if (updatedProduct) {
      logger.info(`✅ Updated product to: ${updatedProduct.name} (price: $${updatedProduct.price})`);
    }
    
    // Get products by category
    const productsByCategory = await Product.find({ category: categoryId });
    logger.info(`✅ Retrieved products by category (${productsByCategory.length} found)`);
    
    // Get featured products
    const featuredProducts = await Product.find({ featured: true });
    logger.info(`✅ Retrieved featured products (${featuredProducts.length} found)`);
    
    // 3. Clean up test data
    logger.info('3️⃣ Cleaning up test data...');
    
    // Delete product
    await Product.findByIdAndDelete(productId);
    logger.info('✅ Deleted test product');
    
    // Delete category
    await Category.findByIdAndDelete(categoryId);
    logger.info('✅ Deleted test category');
    
    logger.info('🎉 Model test completed successfully!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('✅ MongoDB disconnected');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`❌ Model test failed: ${errorMessage}`);
    logger.error(error instanceof Error && error.stack ? error.stack : '');
    
    // Try to disconnect from MongoDB
    try {
      await mongoose.disconnect();
      logger.info('✅ MongoDB disconnected');
    } catch (disconnectError) {
      // Ignore errors during disconnect
    }
    
    process.exit(1);
  }
}

// Run the test
testModels().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
