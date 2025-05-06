import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Order } from '../types/order.types';
import orderApi from '../api/order';

/**
 * State for order history management
 */
interface OrderState {
  // Orders state
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  
  // Actions
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<boolean>;
  clearOrdersError: () => void;
  resetOrdersState: () => void;
}

/**
 * Zustand store for order management
 * Handles user order history and related operations
 */
const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,
      pagination: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
      },
      
      /**
       * Fetch order history from API
       */
      fetchOrders: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        
        try {
          // Temporaire: API backend à implémenter
          // Commenter la requête API qui échoue
          // const response = await orderApi.getOrders(page, limit);
          // const { orders, totalCount, totalPages, currentPage } = response.data.data;
          
          // En attendant l'implémentation backend, retourner un message informatif
          set({
            orders: [],
            pagination: {
              totalCount: 0,
              totalPages: 0,
              currentPage: 1,
              limit,
            },
            error: "L'historique des commandes sera disponible prochainement. L'API backend est en cours d'implémentation.",
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Échec lors de la récupération des commandes';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },
      
      /**
       * Fetch a specific order by ID
       */
      fetchOrderById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderApi.getOrderById(id);
          const order = response.data.data;
          
          set({
            currentOrder: order,
            isLoading: false,
          });
          
          return order;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Échec lors de la récupération de la commande';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return null;
        }
      },
      
      /**
       * Cancel an order
       */
      cancelOrder: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderApi.cancelOrder(id);
          const updatedOrder = response.data.data;
          
          // Update orders list with cancelled order
          const updatedOrders = get().orders.map(order => 
            order.id === id ? updatedOrder : order
          );
          
          set({
            orders: updatedOrders,
            currentOrder: get().currentOrder?.id === id ? updatedOrder : get().currentOrder,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Échec lors de l\'annulation de la commande';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Clear orders error state
       */
      clearOrdersError: () => {
        set({ error: null });
      },
      
      /**
       * Reset orders state (useful for logout)
       */
      resetOrdersState: () => {
        set({
          orders: [],
          currentOrder: null,
          error: null,
          pagination: {
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 10,
          },
        });
      },
    })
  )
);

export default useOrderStore;
