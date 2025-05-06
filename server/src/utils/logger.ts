/**
 * Simple logger utility for server operations
 * Provides different log levels with timestamps and formatted output
 */
export const logger = {
  info: (message: string): void => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`);
  },
  
  warn: (message: string): void => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${message}`);
  },
  
  error: (message: string): void => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`);
  },
  
  debug: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${message}`);
    }
  }
};
