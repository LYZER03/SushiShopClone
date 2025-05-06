import { create } from 'zustand';

interface LoadingState {
  /**
   * Global loading state management for the application
   * Used to show loading indicators when navigating between pages or during major data fetches
   */
  isLoading: boolean;
  key: string | null;
  setLoading: (isLoading: boolean, key?: string | null) => void;
}

/**
 * Global loading state hook using Zustand
 * This allows components to coordinate loading states across the app
 */
const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  key: null,
  setLoading: (isLoading: boolean, key: string | null = null) => 
    set({ isLoading, key: isLoading ? key : null }),
}));

/**
 * Hook to access the loading state
 * @param key Optional key to filter loading state for specific operations
 * @returns Loading state and setLoading function
 */
export function useLoading(key?: string) {
  const { isLoading, setLoading } = useLoadingStore();
  const storeKey = useLoadingStore((state) => state.key);
  
  // If a key is provided, check if it matches the current loading key
  const isLoadingForKey = key 
    ? isLoading && (storeKey === key || storeKey === null)
    : isLoading;
  
  return {
    isLoading: isLoadingForKey,
    setLoading: (loading: boolean) => setLoading(loading, key || null),
  };
}
