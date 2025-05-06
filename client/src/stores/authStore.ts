import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '../api/client';

// Define types for the auth store
// User interface matching backend response
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

// Authentication state and actions
export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  
  // Token management
  setToken: (token: string, refreshToken?: string) => void;
  getProfile: () => Promise<User | null>;
  
  // Password management
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
}

/**
 * Authentication store using Zustand
 * Manages user authentication state and provides methods for login, registration,
 * and other authentication-related actions.
 */
const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        /**
         * Login user with email and password
         * @returns boolean Success status
         */
        login: async (email: string, password: string): Promise<boolean> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.login({ email, password });
            const { user, token, refreshToken } = response.data.data || response.data;
            
            // Map backend user data to frontend User type
            const userData: User = {
              id: user._id || user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            };
            
            // Update auth store
            set({
              user: userData,
              accessToken: token,
              refreshToken: refreshToken || null,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
              (error instanceof Error ? error.message : 'Login failed');
              
            set({
              error: errorMessage,
              isLoading: false,
            });
            
            return false;
          }
        },

        /**
         * Logout user and clear auth state
         */
        logout: (): void => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        },

        /**
         * Register a new user
         * @returns boolean Success status
         */
        register: async (
          firstName: string,
          lastName: string,
          email: string,
          password: string
        ): Promise<boolean> => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.register({ 
              firstName, 
              lastName, 
              email, 
              password 
            });
            
            const { user, token, refreshToken } = response.data.data || response.data;
            
            // Map backend user data to frontend User type
            const userData: User = {
              id: user._id || user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            };
            
            // Update auth store
            set({
              user: userData,
              accessToken: token,
              refreshToken: refreshToken || null,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
              (error instanceof Error ? error.message : 'Registration failed');
              
            set({
              error: errorMessage,
              isLoading: false,
            });
            
            return false;
          }
        },

        /**
         * Set a JWT token and optional refresh token
         */
        setToken: (token: string, refreshToken?: string): void => {
          set({
            accessToken: token,
            refreshToken: refreshToken || get().refreshToken,
          });
        },
        
        /**
         * Get current user profile from the server
         * @returns User object or null if not authenticated
         */
        getProfile: async (): Promise<User | null> => {
          try {
            if (!get().accessToken) return null;
            
            const response = await authApi.getProfile();
            const userData = response.data.data || response.data.user;
            
            if (!userData) return null;
            
            // Map backend user data to frontend User type
            const user: User = {
              id: userData._id || userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt
            };
            
            // Update user data in store
            set({ user, isAuthenticated: true });
            return user;
          } catch (error) {
            // Profile fetch failed, likely token expired
            return null;
          }
        },
        
        /**
         * Request password reset for a user
         */
        forgotPassword: async (email: string): Promise<boolean> => {
          set({ isLoading: true, error: null });
          try {
            await authApi.forgotPassword(email);
            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Password reset request failed', 
              isLoading: false 
            });
            return false;
          }
        },
        
        /**
         * Reset password using a token
         */
        resetPassword: async (
          token: string, 
          password: string, 
          confirmPassword: string
        ): Promise<boolean> => {
          set({ isLoading: true, error: null });
          try {
            await authApi.resetPassword(token, { password, confirmPassword });
            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Password reset failed', 
              isLoading: false 
            });
            return false;
          }
        },
        
        /**
         * Change password for an authenticated user
         */
        changePassword: async (
          currentPassword: string, 
          newPassword: string, 
          confirmPassword: string
        ): Promise<boolean> => {
          set({ isLoading: true, error: null });
          try {
            await authApi.changePassword({ 
              currentPassword, 
              newPassword, 
              confirmPassword 
            });
            set({ isLoading: false });
            return true;
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Password change failed', 
              isLoading: false 
            });
            return false;
          }
        },
        
        /**
         * Set an error message
         */
        setError: (error: string): void => {
          set({ error });
        },
        
        /**
         * Clear error message
         */
        clearError: (): void => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        // SECURITY NOTE: We're storing tokens in localStorage for functionality
        // This is a compromise between security and usability
        // In a production environment, consider using more secure alternatives:
        // - HttpOnly cookies for tokens (requires server-side support)
        // - Token rotation with shorter expiration times
        // - Implement refresh token mechanism correctly
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    )
  )
);

export default useAuthStore;
