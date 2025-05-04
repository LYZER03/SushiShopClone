import { create } from 'zustand';
import { Product, ProductFilterOptions, ProductSortOptions } from '../types/product.types';

interface ProductState {
  // Product Data
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Filters and Sorting
  filters: ProductFilterOptions;
  sortOptions: ProductSortOptions;
  
  // Selected Product
  selectedProduct: Product | null;
  
  // Mock data flag (will be removed when API is connected)
  useMockData: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilterOptions>) => void;
  setSortOptions: (sortOptions: ProductSortOptions) => void;
  clearFilters: () => void;
  searchProducts: (searchTerm: string) => void;
  getFilteredProducts: () => Product[];
}

// Initial mock data for development purposes
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over seasoned rice',
    price: 7.99,
    category: 'sushi',
    tags: ['popular'],
    images: [
      {
        url: '/images/products/salmon-nigiri.jpg',
        alt: 'Salmon Nigiri',
        isDefault: true,
      },
    ],
    ingredients: ['Salmon', 'Rice', 'Wasabi'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 50,
      protein: 7,
      carbs: 10,
      fat: 1,
      sodium: 30,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.8,
    reviewCount: 125,
  },
  {
    id: '2',
    name: 'Tuna Roll',
    description: 'Tuna and cucumber wrapped in seaweed and rice',
    price: 9.99,
    category: 'rolls',
    tags: ['popular', 'spicy'],
    images: [
      {
        url: '/images/products/tuna-roll.jpg',
        alt: 'Tuna Roll',
        isDefault: true,
      },
    ],
    ingredients: ['Tuna', 'Rice', 'Nori', 'Cucumber', 'Spicy Mayo'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 320,
      protein: 15,
      carbs: 45,
      fat: 8,
      sodium: 610,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.6,
    reviewCount: 98,
  },
  {
    id: '3',
    name: 'Vegetable Tempura',
    description: 'Assorted vegetables lightly battered and fried',
    price: 8.50,
    category: 'sides',
    tags: ['vegetarian'],
    images: [
      {
        url: '/images/products/vegetable-tempura.jpg',
        alt: 'Vegetable Tempura',
        isDefault: true,
      },
    ],
    ingredients: ['Vegetables', 'Tempura Batter', 'Dipping Sauce'],
    allergens: ['Gluten'],
    nutritionalInfo: {
      calories: 280,
      protein: 5,
      carbs: 35,
      fat: 12,
      sodium: 320,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.2,
    reviewCount: 67,
  },
  {
    id: '4',
    name: 'Salmon Poke Bowl',
    description: 'Fresh salmon, avocado, edamame, and cucumber over seasoned rice',
    price: 14.99,
    category: 'bowls',
    tags: ['popular', 'new'],
    images: [
      {
        url: '/images/products/salmon-poke-bowl.jpg',
        alt: 'Salmon Poke Bowl',
        isDefault: true,
      },
    ],
    ingredients: ['Salmon', 'Rice', 'Avocado', 'Edamame', 'Cucumber', 'Sesame Seeds', 'Poke Sauce'],
    allergens: ['Fish', 'Soy'],
    nutritionalInfo: {
      calories: 520,
      protein: 35,
      carbs: 55,
      fat: 14,
      sodium: 750,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.9,
    reviewCount: 143,
  },
  {
    id: '5',
    name: 'Green Tea',
    description: 'Traditional Japanese green tea',
    price: 3.50,
    category: 'drinks',
    tags: [],
    images: [
      {
        url: '/images/products/green-tea.jpg',
        alt: 'Green Tea',
        isDefault: true,
      },
    ],
    ingredients: ['Green Tea Leaves'],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sodium: 0,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.1,
    reviewCount: 56,
  },
  {
    id: '6',
    name: 'Unagi Nigiri',
    description: 'Grilled freshwater eel over seasoned rice',
    price: 8.99,
    category: 'sushi',
    tags: ['popular'],
    images: [
      {
        url: '/images/products/unagi-nigiri.jpg',
        alt: 'Unagi Nigiri',
        isDefault: true,
      },
    ],
    ingredients: ['Freshwater Eel', 'Rice', 'Eel Sauce'],
    allergens: ['Fish'],
    nutritionalInfo: {
      calories: 70,
      protein: 6,
      carbs: 11,
      fat: 2,
      sodium: 85,
    },
    isAvailable: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    rating: 4.7,
    reviewCount: 88,
  },
];

const useProductStore = create<ProductState>((set, get) => ({
  // State
  products: [],
  isLoading: false,
  error: null,
  filters: {},
  sortOptions: { field: 'name', order: 'asc' },
  selectedProduct: null,
  useMockData: true, // Set to true for development without backend

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (get().useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ products: mockProducts, isLoading: false });
      } else {
        // TODO: Replace with actual API call when backend is ready
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        set({ products: data, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        isLoading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      if (get().useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        const product = mockProducts.find(p => p.id === id) || null;
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        set({ selectedProduct: product, isLoading: false });
      } else {
        // TODO: Replace with actual API call when backend is ready
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        set({ selectedProduct: data, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        isLoading: false 
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  setSortOptions: (sortOptions) => {
    set({ sortOptions });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  searchProducts: (searchTerm) => {
    set((state) => ({
      filters: { ...state.filters, searchTerm }
    }));
  },

  getFilteredProducts: () => {
    const { products, filters, sortOptions } = get();
    
    // Apply filters
    let filteredProducts = [...products];
    
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.tags?.some((tag) => product.tags.includes(tag))
      );
    }
    
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= (filters.priceRange?.min || 0) &&
          product.price <= (filters.priceRange?.max || Infinity)
      );
    }
    
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      const fieldA = a[sortOptions.field];
      const fieldB = b[sortOptions.field];
      
      if (sortOptions.field === 'name') {
        return sortOptions.order === 'asc'
          ? (fieldA as string).localeCompare(fieldB as string)
          : (fieldB as string).localeCompare(fieldA as string);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortOptions.order === 'asc'
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
      
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortOptions.order === 'asc'
          ? fieldA.getTime() - fieldB.getTime()
          : fieldB.getTime() - fieldA.getTime();
      }
      
      return 0;
    });
    
    return filteredProducts;
  },
}));

export default useProductStore;
