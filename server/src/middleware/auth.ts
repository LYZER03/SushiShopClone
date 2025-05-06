import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import { IUser, UserRole } from '../models/User';
import { ApiError } from './errorHandler';

/**
 * Custom Request interface with user property
 * This extends Express Request to include the authenticated user
 */
export interface AuthRequest extends Request {
  user?: IUser & { _id: any }; // Ensure _id is accessible
}

/**
 * Type definitions for route handlers to make Express and our custom types work together
 */
export type AuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export type ExpressRequestHandler = (req: Request, res: Response, next: NextFunction) => void;

/**
 * Converts an auth handler to an Express-compatible request handler
 * This works around TypeScript limitations with extending the Express Request type
 */
export const createHandler = (handler: AuthRequestHandler): any => {
  // Using 'any' type for the return value to bypass TypeScript's strict checking
  // This is safe because we maintain the correct function signature
  return (req: Request, res: Response, next: NextFunction): void => {
    // Cast the request to AuthRequest (safe because authenticate middleware adds user property)
    handler(req as AuthRequest, res, next).catch(next);
  };
};

// Type utility for Express route handlers to work with AuthRequest
type ExpressHandler = (req: Request, res: Response, next: NextFunction) => void;

/**
 * A wrapper around the Express Router methods to make them work with AuthRequest handlers
 * This is a type-safe solution for Express route handlers with authorization
 */
export const createAuthMiddleware = (handler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>): ExpressHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req as AuthRequest, res, next).catch(next);
  };
};

/**
 * Middleware to authenticate user with JWT
 * Adds the user object to the request if authenticated
 * Returns an ExpressJS compatible middleware function
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(new ApiError(401, info?.message || 'Authentication failed'));
    }
    
    // Add user to request
    (req as AuthRequest).user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to authorize user based on roles
 * @param roles Array of allowed roles
 */
export const authorize = (roles: UserRole[] = []): (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }
    
    if (roles.length && !roles.includes(authReq.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`)
      );
    }
    
    next();
  };
};

/**
 * Middleware to check if user is accessing their own resource
 * For routes like /users/:id where the user should only access their own data
 * @param userIdParam Parameter name that contains the user ID (default: 'id')
 */
export const isResourceOwner = (userIdParam: string = 'id'): (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const paramId = req.params[userIdParam];
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }
    
    // Allow admins to access any resource
    if (authReq.user.role === UserRole.ADMIN) {
      return next();
    }
    
    // Check if user is accessing their own resource
    const userId = authReq.user._id.toString();
    if (userId !== paramId) {
      return next(new ApiError(403, 'Access denied. You can only access your own resources'));
    }
    
    next();
  };
};
