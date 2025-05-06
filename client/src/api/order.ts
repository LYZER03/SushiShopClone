import apiClient from './client';
import type { OrderResponse, OrdersResponse } from '../types';

const orderApi = {
  /**
   * Get orders history for the current user
   */
  getOrders: async (page = 1, limit = 10) => {
    return apiClient.get<OrdersResponse>(`/orders?page=${page}&limit=${limit}`);
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (orderId: string) => {
    return apiClient.get<OrderResponse>(`/orders/${orderId}`);
  },

  /**
   * Cancel an order (if it's still in a cancelable state)
   */
  cancelOrder: async (orderId: string) => {
    return apiClient.patch<OrderResponse>(`/orders/${orderId}/cancel`);
  },
};

export default orderApi;
