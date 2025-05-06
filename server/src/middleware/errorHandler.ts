import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom API error class with status code and message
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware for Express
 * Formats errors and sends appropriate HTTP responses
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Generate a unique request ID for tracking this error
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Default status code and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Check if this is our custom API error
  if ('statusCode' in err && typeof (err as ApiError).statusCode === 'number') {
    statusCode = (err as ApiError).statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    // Handle Mongoose cast errors (usually invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    // Handle JWT expiration
    statusCode = 401;
    message = 'Authentication token expired';
  }
  
  // Log the error with context
  logger.error(`[${requestId}] ${statusCode} - ${message} - ${req.method} ${req.originalUrl}`);
  
  // Only log stack trace for server errors in development
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    console.error(err.stack);
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      requestId,
      ...(process.env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {})
    }
  });
};
