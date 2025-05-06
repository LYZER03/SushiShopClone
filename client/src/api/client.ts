import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../stores/authStore';

// Get the API URL from environment variables or use a default for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Custom Axios instance configured for the Sushi Shop API
 * Handles authentication tokens, error handling, and token refresh
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedRequestsQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

/**
 * Process the queue of failed requests
 * @param token New access token
 * @param error Error object if refresh failed
 */
const processQueue = (
  token: string | null = null,
  error: Error | null = null
): void => {
  failedRequestsQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      // Retry the request with new token
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(apiClient(request.config));
    }
  });
  
  // Clear the queue
  failedRequestsQueue = [];
};

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    
    // Skip if error is from a refresh token request to avoid infinite loops
    const isRefreshRequest = originalRequest.url?.includes('refresh-token');
    
    // Add property to track retry attempts
    interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean;
    }
    const extendedRequest = originalRequest as ExtendedInternalAxiosRequestConfig;
    
    // Handle token expiration with refresh attempt
    if (error.response?.status === 401 && !isRefreshRequest && !extendedRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }
      
      extendedRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          // No refresh token available, logout user
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
        
        const response = await apiClient.post('/auth/refresh-token');
        const { token: newToken } = response.data;
        
        // Update auth store with new token
        useAuthStore.getState().setToken(newToken);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process queued requests with new token
        processQueue(newToken);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        processQueue(null, refreshError as Error);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other 401 errors or failed refresh, log the user out
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => apiClient.post('/auth/register', userData),
  
  /**
   * Login user
   */
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  
  /**
   * Get current user profile
   */
  getProfile: () => apiClient.get('/auth/me'),
  
  /**
   * Request password reset
   */
  forgotPassword: (email: string) => 
    apiClient.post('/auth/forgot-password', { email }),
  
  /**
   * Reset password with token
   */
  resetPassword: (token: string, passwords: { password: string; confirmPassword: string }) => 
    apiClient.post(`/auth/reset-password/${token}`, passwords),
  
  /**
   * Change password (authenticated)
   */
  changePassword: (passwords: { 
    currentPassword: string; 
    newPassword: string; 
    confirmPassword: string 
  }) => apiClient.post('/auth/change-password', passwords),
};
