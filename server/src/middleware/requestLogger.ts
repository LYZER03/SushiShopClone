import morgan from 'morgan';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/config';

/**
 * Custom Morgan token for request ID
 */
morgan.token('request-id', (req: Request) => {
  return req.headers['x-request-id'] as string || 
    `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
});

/**
 * Custom Morgan token for colored status code
 */
morgan.token('status-colored', (req: Request, res: Response) => {
  const status = res.statusCode;
  let color = '';
  
  // Color based on status code
  if (status >= 500) {
    color = '\x1b[31m'; // Red
  } else if (status >= 400) {
    color = '\x1b[33m'; // Yellow
  } else if (status >= 300) {
    color = '\x1b[36m'; // Cyan
  } else {
    color = '\x1b[32m'; // Green
  }
  
  return `${color}${status}\x1b[0m`; // Reset color after status
});

/**
 * Development request logger - more verbose with colors
 */
export const developmentLogger = morgan(
  ':method :url :status-colored :response-time ms - :res[content-length] - :request-id',
  {
    skip: (req, res) => {
      // Skip logging for successful health check requests to reduce noise
      return req.url?.includes('/health') === true && res.statusCode === 200;
    }
  }
);

/**
 * Production request logger - machine readable format
 */
export const productionLogger = morgan(
  ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms - :request-id',
  {
    skip: (req, res) => {
      // Skip logging for successful health check requests to reduce noise
      return req.url?.includes('/health') === true && res.statusCode === 200;
    },
    stream: {
      // Write to our custom logger instead of stdout
      write: (message: string) => {
        logger.info(message.trim());
      }
    }
  }
);

/**
 * Request logger middleware based on environment
 */
export const requestLogger = config.env === 'development' 
  ? developmentLogger 
  : productionLogger;
