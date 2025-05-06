import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { standardLimiter } from './rateLimiter';
import { requestLogger } from './requestLogger';
import { errorHandler } from './errorHandler';
import { setupSwagger } from './swagger';
import { config } from '../config/config';

/**
 * Apply all middleware to Express application
 * @param app Express application instance
 */
export const applyMiddleware = (app: Express): void => {
  // Security middleware
  app.use(helmet()); // Set security headers
  
  // CORS configuration with options
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = Array.isArray(config.corsOrigin) 
        ? config.corsOrigin 
        : [config.corsOrigin];
        
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID']
  }));
  
  // Request parsing middleware
  app.use(express.json({ limit: '10kb' })); // Body parser, limit request size to 10kb
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser()); // Parse Cookie header and populate req.cookies
  
  // Performance middleware
  app.use(compression()); // Compress responses
  
  // Request logging
  app.use(requestLogger);
  
  // Rate limiting (applied to all routes)
  app.use(standardLimiter);
  
  // Add request ID if not present
  app.use((req, res, next) => {
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    }
    next();
  });
  
  // Set up API documentation with Swagger
  setupSwagger(app);
};

/**
 * Apply error handling middleware to Express application
 * This should be applied after all routes
 * @param app Express application instance
 */
export const applyErrorHandlers = (app: Express): void => {
  // Handle 404 for undefined routes
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        code: 'ROUTE_NOT_FOUND',
        timestamp: new Date().toISOString()
      }
    });
  });
  
  // Global error handler
  app.use(errorHandler);
};
