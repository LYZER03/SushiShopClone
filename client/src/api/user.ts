import apiClient from './client';
import { ProfileUpdateRequest, AddressRequest } from '../types/user.types';

/**
 * User API endpoints for profile and address management
 */
export const userApi = {
  /**
   * Get user profile with detailed information
   */
  getProfile: () => 
    apiClient.get('/users/profile'),
  
  /**
   * Update user profile information
   */
  updateProfile: (data: ProfileUpdateRequest) => 
    apiClient.put('/users/profile', data),
  
  /**
   * Get all user addresses
   */
  getAddresses: () => 
    apiClient.get('/users/addresses'),
  
  /**
   * Get a single address by ID
   */
  getAddressById: (id: string) => 
    apiClient.get(`/users/addresses/${id}`),
  
  /**
   * Create a new address
   */
  createAddress: (address: AddressRequest) => 
    apiClient.post('/users/addresses', address),
  
  /**
   * Update an existing address
   */
  updateAddress: (id: string, address: AddressRequest) => 
    apiClient.patch(`/users/addresses/${id}`, address),
  
  /**
   * Delete an address
   */
  deleteAddress: (id: string) => 
    apiClient.delete(`/users/addresses/${id}`),
  
  /**
   * Set an address as default
   */
  setDefaultAddress: (id: string) => 
    apiClient.patch(`/users/addresses/${id}/default`, {}),
  
  /**
   * Get user order history
   */
  getOrderHistory: (page = 1, limit = 10) => 
    apiClient.get(`/users/orders?page=${page}&limit=${limit}`),
  
  /**
   * Get order details by ID
   */
  getOrderById: (id: string) => 
    apiClient.get(`/users/orders/${id}`),
};

export default userApi;
