import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

/**
 * API Rate Limiter Middleware
 * Limits the number of requests a client can make within a timeframe
 * Different limiters for standard API routes and authentication routes
 */

// Standard API rate limiter (higher limit for normal operation)
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  skip: () => config.env === 'development' // Skip rate limiting in development
});

// Authentication rate limiter (stricter for security)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts from this IP, please try again after an hour',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  skip: () => config.env === 'development' // Skip rate limiting in development
});
