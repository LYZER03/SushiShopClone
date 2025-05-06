import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  data: Product;
}

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  byCategory: (categoryId: string) => [...productKeys.all, 'category', categoryId] as const,
};

// Get all products (with optional filters)
export const useProducts = (filters?: Record<string, unknown>) => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  
  const queryKey = filters ? productKeys.list(filters) : productKeys.lists();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const { data } = await apiClient.get<ProductsResponse>(url);
      return data;
    },
  });
};

// Get a single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ProductResponse>(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: async () => {
      const { data } = await apiClient.get<ProductsResponse>('/products/featured');
      return data;
    },
  });
};

// Get products by category
export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: async () => {
      const { data } = await apiClient.get<ProductsResponse>(`/products/category/${categoryId}`);
      return data;
    },
    enabled: !!categoryId,
  });
};

// Create a new product (admin only)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProduct: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await apiClient.post<ProductResponse>('/products', newProduct);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update a product (admin only)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Product>) => {
      const { data } = await apiClient.put<ProductResponse>(`/products/${id}`, updates);
      return data;
    },
    onSuccess: (data) => {
      // Update the cache for this specific product
      queryClient.setQueryData(productKeys.detail(data.data._id), data);
      // Invalidate all product lists as this could affect many lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete a product (admin only)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
