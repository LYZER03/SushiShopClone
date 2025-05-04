import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define types for the auth store
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'staff' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  clearError: () => void;
}

// Create the auth store
const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Login action (placeholder, will be implemented with actual API later)
        login: async (email: string, password: string): Promise<void> => {
          set({ isLoading: true, error: null });
          try {
            // This will be replaced with actual API call
            console.log('Login attempt with:', email, password);
            
            // Simulate successful login for now
            const mockUser: User = {
              id: '1',
              email,
              firstName: 'Test',
              lastName: 'User',
              role: 'customer',
            };
            
            set({
              user: mockUser,
              accessToken: 'mock-token',
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false,
            });
          }
        },

        // Logout action
        logout: (): void => {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        },

        // Register action (placeholder)
        register: async (
          firstName: string,
          lastName: string,
          email: string,
          password: string
        ): Promise<void> => {
          set({ isLoading: true, error: null });
          try {
            // This will be replaced with actual API call
            console.log('Register attempt with:', firstName, lastName, email, password);
            
            // Simulate successful registration
            const mockUser: User = {
              id: '1',
              email,
              firstName,
              lastName,
              role: 'customer',
            };
            
            set({
              user: mockUser,
              accessToken: 'mock-token',
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error 
                ? error.message 
                : 'Registration failed',
              isLoading: false,
            });
          }
        },

        // Clear error action
        clearError: (): void => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        // Don't persist token in localStorage for security
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useAuthStore;
