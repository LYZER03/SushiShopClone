import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define types for cart items and cart state
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Computed properties
  totalItems: number;
  totalPrice: number;
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Create the cart store
const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,
        
        // Computed property getters
        get totalItems() {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },
        
        get totalPrice() {
          return get().items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
        },
        
        // Add an item to the cart
        addItem: (product: Product, quantity = 1): void => {
          const currentItems = get().items;
          const existingItem = currentItems.find(
            item => item.product.id === product.id
          );
          
          if (existingItem) {
            // Update quantity if item already exists
            set({
              items: currentItems.map(item => 
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            // Add new item
            set({
              items: [...currentItems, { product, quantity }],
            });
          }
          
          // Open cart when adding items
          set({ isOpen: true });
        },
        
        // Update quantity of an item
        updateQuantity: (productId: string, quantity: number): void => {
          const currentItems = get().items;
          
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            set({
              items: currentItems.filter(item => item.product.id !== productId),
            });
          } else {
            // Update quantity
            set({
              items: currentItems.map(item => 
                item.product.id === productId
                  ? { ...item, quantity }
                  : item
              ),
            });
          }
        },
        
        // Remove an item from cart
        removeItem: (productId: string): void => {
          set({
            items: get().items.filter(item => item.product.id !== productId),
          });
        },
        
        // Clear all items from cart
        clearCart: (): void => {
          set({ items: [] });
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
