/**
 * Product-related type definitions
 */

export type ProductCategory = 
  | 'sushi'
  | 'sashimi'
  | 'rolls'
  | 'bowls'
  | 'sides'
  | 'drinks';

export type ProductTag =
  | 'popular'
  | 'new'
  | 'spicy'
  | 'vegetarian'
  | 'gluten-free';

export interface ProductImage {
  url: string;
  alt: string;
  isDefault: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  tags: ProductTag[];
  images: ProductImage[];
  ingredients: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  isAvailable: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilterOptions {
  category?: ProductCategory;
  tags?: ProductTag[];
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  order: 'asc' | 'desc';
}
