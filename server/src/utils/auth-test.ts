import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User, { UserRole } from '../models/User';
import { logger } from './logger';

/**
 * Test script to validate the User model and authentication functionality
 * This script will:
 * 1. Create a test user
 * 2. Verify password hashing
 * 3. Test JWT token generation and verification
 * 4. Test user login flow
 */
export const testAuthFunctionality = async (): Promise<void> => {
  try {
    logger.info('🔑 Starting authentication functionality test...');

    // 1. Create a test user
    const testUser = {
      email: 'test@example.com',
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.CUSTOMER
    };

    // Delete the test user if it already exists
    await User.deleteOne({ email: testUser.email });
    
    // Create a new user
    const user = new User(testUser);
    await user.save();
    
    logger.info(`✅ Test user created: ${user.email}`);

    // 2. Verify password hashing
    const savedUser = await User.findOne({ email: testUser.email }).select('+password');
    if (!savedUser) {
      throw new Error('Failed to retrieve test user');
    }
    
    // Check that the password is hashed
    if (savedUser.password === testUser.password) {
      throw new Error('Password was not hashed correctly');
    }
    
    // Verify that bcrypt.compare works correctly
    const isMatch = await savedUser.comparePassword(testUser.password);
    if (!isMatch) {
      throw new Error('Password comparison failed');
    }
    
    logger.info('✅ Password hashing verified');

    // 3. Test JWT token generation and verification
    const token = savedUser.generateAuthToken();
    if (!token) {
      throw new Error('Failed to generate JWT token');
    }
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      if (typeof decoded !== 'object' || !decoded.id) {
        throw new Error('JWT token payload is invalid');
      }
      logger.info('✅ JWT token generation and verification successful');
    } catch (error) {
      throw new Error(`JWT token verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 4. Test user login flow (manual simulation)
    const loginUser = await User.findOne({ email: testUser.email }).select('+password');
    if (!loginUser) {
      throw new Error('Failed to retrieve test user for login');
    }
    
    // Verify password
    const passwordValid = await loginUser.comparePassword(testUser.password);
    if (!passwordValid) {
      throw new Error('Password validation failed during login simulation');
    }
    
    // Generate auth token
    const loginToken = loginUser.generateAuthToken();
    if (!loginToken) {
      throw new Error('Failed to generate authentication token during login simulation');
    }
    
    logger.info('✅ Login flow simulation successful');
    
    // Test complete
    logger.info('🎉 Authentication functionality test completed successfully!');
    
    // Clean up - delete test user
    await User.deleteOne({ email: testUser.email });
    logger.info('🧹 Test cleanup completed');
    
    return;
  } catch (error) {
    logger.error(`❌ Authentication test failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// Execute the test if this file is run directly
if (require.main === module) {
  // Connect to the database
  mongoose.connect(config.mongoUri)
    .then(async () => {
      logger.info('Connected to MongoDB');
      try {
        await testAuthFunctionality();
        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    })
    .catch((error) => {
      logger.error(`Database connection error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    });
}
