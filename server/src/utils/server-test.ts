import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Express } from 'express';
import { logger } from '../utils/logger';
import '../models/User';
import '../models/Category';
import '../models/Product';
import apiRoutes from '../routes';
import { config } from '../config/config';
import { applyMiddleware, applyErrorHandlers } from '../middleware';

// Load environment variables
dotenv.config();

/**
 * Test server startup
 */
async function testServer(): Promise<void> {
  try {
    logger.info('🧪 Starting server test...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi-shop';
    await mongoose.connect(mongoUri);
    logger.info('✅ Connected to MongoDB successfully');

    // Initialize Express application with middleware and routes
    const app: Express = express();

    // Apply all middleware (security, parsing, logging, etc.)
    applyMiddleware(app);

    // Register routes
    logger.info('📋 Registering routes...');
    
    try {
      // Apply API routes
      app.use(config.apiPrefix, apiRoutes);
      logger.info('✅ Routes registered successfully');
    } catch (routeError) {
      logger.error(`❌ Error registering routes: ${routeError instanceof Error ? routeError.message : String(routeError)}`);
      logger.error(routeError instanceof Error && routeError.stack ? routeError.stack : '');
      throw routeError;
    }

    // Apply error handling middleware at the end
    applyErrorHandlers(app);

    // Start the server
    const PORT = config.port;
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running in ${config.env} mode on port ${PORT}`);
    });

    // Listen for server errors
    server.on('error', (error: Error) => {
      logger.error(`❌ Server error: ${error.message}`);
      logger.error(error.stack || '');
      process.exit(1);
    });

    // Keep the server running for 5 seconds for testing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Gracefully shut down
    logger.info('🧪 Test completed, shutting down server...');
    server.close(() => {
      logger.info('✅ Server closed');
      mongoose.disconnect()
        .then(() => {
          logger.info('✅ MongoDB disconnected');
          process.exit(0);
        })
        .catch(err => {
          logger.error(`❌ Error disconnecting from MongoDB: ${err.message}`);
          process.exit(1);
        });
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`❌ Server test failed: ${errorMessage}`);
    logger.error(error instanceof Error && error.stack ? error.stack : '');
    
    // Try to disconnect from MongoDB
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore errors during disconnect
    }
    
    process.exit(1);
  }
}

// Run the test
testServer();
