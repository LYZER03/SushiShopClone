import { useState, useCallback } from 'react';

/**
 * Hook to manage cart sidebar state
 * Provides open/close functionality and state
 */
const useCartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
    // Prevent body scrolling when sidebar is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    // Restore body scrolling when sidebar is closed
    document.body.style.overflow = 'auto';
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  }, []);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar
  };
};

export default useCartSidebar;
