import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, CartState, Product } from '../types/cart.types';

// Helper function to calculate total items
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Helper function to calculate total price
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Create the cart store
const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,
        totalItems: 0,
        total: 0,
        
        // Add an item to the cart
        addItem: (item: Product | CartItem, quantity = 1): void => {
          const currentItems = get().items;
          const existingItem = currentItems.find(
            cartItem => cartItem.id === (item as CartItem).id || cartItem.id === (item as Product).id
          );
          
          let updatedItems: CartItem[];
          
          if (existingItem) {
            // Update quantity if item already exists
            updatedItems = currentItems.map(cartItem => 
              cartItem.id === existingItem.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            );
          } else {
            // Add new item - flatten structure to match CartItem interface
            const newItem: CartItem = {
              id: (item as CartItem).id || (item as Product).id,
              name: (item as CartItem).name || (item as Product).name,
              price: (item as CartItem).price || (item as Product).price,
              quantity: quantity,
              imageUrl: (item as CartItem).imageUrl || (item as Product).imageUrl
            };
            
            updatedItems = [...currentItems, newItem];
          }
          
          // Update cart with new items and calculate totals
          set({ 
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            total: calculateTotal(updatedItems),
            isOpen: true 
          });
        },
        
        // Update item quantity
        updateItemQuantity: (itemId: string, quantity: number): void => {
          const currentItems = get().items;
          let updatedItems: CartItem[];
          
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            updatedItems = currentItems.filter(item => item.id !== itemId);
          } else {
            // Update quantity
            updatedItems = currentItems.map(item => 
              item.id === itemId
                ? { ...item, quantity }
                : item
            );
          }
          
          set({
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            total: calculateTotal(updatedItems)
          });
        },
        
        // Remove an item from cart
        removeItem: (itemId: string): void => {
          const updatedItems = get().items.filter(item => item.id !== itemId);
          set({
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            total: calculateTotal(updatedItems)
          });
        },
        
        // Clear all items from cart
        clearCart: (): void => {
          set({ 
            items: [],
            totalItems: 0,
            total: 0
          });
        },
        
        // Open cart sidebar/drawer
        openCart: (): void => {
          set({ isOpen: true });
        },
        
        // Close cart sidebar/drawer
        closeCart: (): void => {
          set({ isOpen: false });
        },
      }),
      {
        name: 'cart-storage',
      }
    )
  )
);

export default useCartStore;
