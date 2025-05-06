import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from './config';

/**
 * Connection options for MongoDB
 */
const connectionOptions = {
  autoIndex: true, // Build indexes in development
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
};

/**
 * Connection state constants
 */
const STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized'
};

/**
 * Connect to MongoDB database
 * Uses the MONGO_URI environment variable for connection string
 * @returns Mongoose connection
 */
export const connectDatabase = async (): Promise<mongoose.Connection> => {
  try {
    // Get connection URI from environment variables
    const mongoUri = config.mongoUri;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Connect to the database with options
    await mongoose.connect(mongoUri, connectionOptions);
    
    const connection = mongoose.connection;
    
    // Log connection state
    logger.info(`MongoDB connection established successfully - Connection state: ${STATES[connection.readyState as keyof typeof STATES]}`);
    
    // Log when connection is disconnected
    connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });
    
    // Log when connection is reconnected
    connection.on('reconnected', () => {
      logger.info('MongoDB connection reestablished');
    });
    
    // Log connection errors
    connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
      // Only exit in production, in development just log the error
      if (config.env === 'production') {
        process.exit(1);
      }
    });
    
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`);
    // Only exit in production, in development just throw the error to be caught by caller
    if (config.env === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Close the MongoDB connection gracefully
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed successfully');
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};
