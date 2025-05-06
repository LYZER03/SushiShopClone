import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

// Types
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  count: number;
  data: Category[];
}

interface CategoryResponse {
  success: boolean;
  data: Category;
}

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  bySlug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
};

// Get all categories (with optional filters)
export const useCategories = (filters?: Record<string, unknown>) => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  
  const queryKey = filters ? categoryKeys.list(filters) : categoryKeys.lists();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const { data } = await apiClient.get<CategoriesResponse>(url);
      return data;
    },
  });
};

// Get a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<CategoryResponse>(`/categories/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Get a category by slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: async () => {
      const { data } = await apiClient.get<CategoryResponse>(`/categories/slug/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

// Create a new category (admin only)
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newCategory: Omit<Category, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await apiClient.post<CategoryResponse>('/categories', newCategory);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch all category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Update a category (admin only)
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Category>) => {
      const { data } = await apiClient.put<CategoryResponse>(`/categories/${id}`, updates);
      return data;
    },
    onSuccess: (data) => {
      // Update the cache for this specific category
      queryClient.setQueryData(categoryKeys.detail(data.data._id), data);
      // If slug is updated, invalidate the bySlug query
      queryClient.invalidateQueries({ queryKey: categoryKeys.bySlug(data.data.slug) });
      // Invalidate all category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Delete a category (admin only)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      // Invalidate all category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
