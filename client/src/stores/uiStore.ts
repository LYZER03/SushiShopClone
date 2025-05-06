import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  /**
   * UI state for the application
   */
  // Mobile menu visibility
  isMobileMenuOpen: boolean;
  // Theme mode (light/dark)
  colorMode: 'light' | 'dark';
  // Filter sidebar visibility (for product listings)
  isFilterSidebarOpen: boolean;
  
  // Actions
  toggleMobileMenu: () => void;
  toggleColorMode: () => void;
  toggleFilterSidebar: () => void;
  
  // Setters
  setMobileMenuOpen: (isOpen: boolean) => void;
  setColorMode: (mode: 'light' | 'dark') => void;
  setFilterSidebarOpen: (isOpen: boolean) => void;
}

/**
 * UI state store using Zustand
 * Manages global UI state like menu visibility, theme mode, etc.
 */
const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      isMobileMenuOpen: false,
      colorMode: 'light',
      isFilterSidebarOpen: false,
      
      // Toggle actions
      toggleMobileMenu: () => 
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      toggleColorMode: () => 
        set((state) => ({ 
          colorMode: state.colorMode === 'light' ? 'dark' : 'light'
        })),
      
      toggleFilterSidebar: () => 
        set((state) => ({ isFilterSidebarOpen: !state.isFilterSidebarOpen })),
      
      // Direct setters
      setMobileMenuOpen: (isOpen: boolean) => 
        set({ isMobileMenuOpen: isOpen }),
      
      setColorMode: (mode: 'light' | 'dark') => 
        set({ colorMode: mode }),
      
      setFilterSidebarOpen: (isOpen: boolean) => 
        set({ isFilterSidebarOpen: isOpen }),
    }),
    { name: 'ui-store' }
  )
);

export default useUIStore;
