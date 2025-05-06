import express, { Express } from 'express';
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { testDatabaseConnection } from './utils/db-test';
import { applyMiddleware, applyErrorHandlers } from './middleware';
import passport from 'passport';
import { initializePassport } from './config/passport';

// Import API routes
import apiRoutes from './routes';

/**
 * Initialize Express application with middleware and routes
 */
const app: Express = express();

// Apply all middleware (security, parsing, logging, etc.)
applyMiddleware(app);

// Initialize Passport.js
initializePassport();
app.use(passport.initialize());

// Apply API routes
app.use(config.apiPrefix, apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sushi Shop API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}${config.apiPrefix}/docs`,
    apiRoot: `${req.protocol}://${req.get('host')}${config.apiPrefix}`
  });
});

// Apply error handling middleware at the end
applyErrorHandlers(app);

/**
 * Start the server and connect to database
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first before starting the Express server
    if (config.env !== 'test') {
      try {
        const dbConnection = await connectDatabase();
        logger.info(`MongoDB connected successfully - Database: ${dbConnection.name}`);
        
        // Run database connectivity test if in development mode
        if (config.env === 'development') {
          logger.info('Running database connectivity tests...');
          try {
            // Ne pas fermer la connexion après les tests
            await testDatabaseConnection(false);
            // Pas besoin de journaliser à nouveau, la fonction le fait déjà
          } catch (testError) {
            logger.warn(`Database connectivity tests failed: ${testError instanceof Error ? testError.message : String(testError)}`);
            logger.warn('Please check your MongoDB configuration and schema definitions');
            // Continue anyway since we're in development mode
          }
        }
        
        // Only start Express server after MongoDB is successfully connected
        startExpressServer();
      } catch (dbError) {
        // In development, we can still start the server even if MongoDB fails
        if (config.env === 'development') {
          logger.warn(`MongoDB connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
          logger.warn('Starting server anyway, but endpoints requiring database access will not work');
          startExpressServer();
        } else {
          // In production, exit if MongoDB connection fails
          logger.error(`MongoDB connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
          process.exit(1);
        }
      }
    } else {
      // In test mode, just start the server without MongoDB
      startExpressServer();
    }
  } catch (error) {
    logger.error(`Server startup failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

/**
 * Start the Express server
 */
const startExpressServer = (): void => {
  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    logger.info(`API available at http://localhost:${config.port}${config.apiPrefix}`);
  });
  
  // Handle server errors
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use`);
    } else {
      logger.error(`Express server error: ${error.message}`);
    }
    process.exit(1);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err instanceof Error ? err.message : String(err)}`);
  // Close server and exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server and exit process
  process.exit(1);
});

// Start the server
startServer();
