import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { config } from './config';
import User from '../models/User';
import { logger } from '../utils/logger';

/**
 * Options for JWT strategy
 */
const jwtOptions = {
  // Extract JWT from the Authorization header with format "Bearer TOKEN"
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Secret key for JWT validation
  secretOrKey: config.jwtSecret,
  // Make passport handle expired tokens rather than throwing an error
  ignoreExpiration: false,
  // Pass the request object to the callback
  passReqToCallback: true as true // Explicitly tell TypeScript this is always true
};

/**
 * Initialize and configure Passport with JWT strategy
 */
export const initializePassport = (): void => {
  passport.use(
    new JwtStrategy(
      jwtOptions,
      async (req: Request, jwtPayload: any, done: any) => {
        try {
          // Verify JWT not expired (though this is also handled by passport)
          const expirationDate = new Date(jwtPayload.exp * 1000);
          if (expirationDate < new Date()) {
            return done(null, false, { message: 'Token expired' });
          }
          
          // Find user by ID from JWT payload
          const user = await User.findById(jwtPayload.id);
          
          // Check if user exists and is active
          if (!user || !user.isActive) {
            return done(null, false, { 
              message: user ? 'Account is deactivated' : 'User not found' 
            });
          }
          
          // Update last login time
          user.lastLogin = new Date();
          await user.save({ validateBeforeSave: false });
          
          // Authentication successful, return user
          return done(null, user);
        } catch (error) {
          logger.error(`JWT authentication error: ${error instanceof Error ? error.message : String(error)}`);
          return done(error);
        }
      }
    )
  );
};

/**
 * Export configured passport
 */
export default passport;
