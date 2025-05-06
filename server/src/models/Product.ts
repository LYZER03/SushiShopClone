import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { ICategory } from './Category';

/**
 * Interface representing a product document in MongoDB
 */
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId | ICategory;
  imageUrl: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isGlutenFree: boolean;
  featured: boolean;
  inStock: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for Product model with static methods
 */
interface IProductModel extends Model<IProduct> {
  getFeaturedProducts(): Promise<IProduct[]>;
  findByCategory(categoryId: Types.ObjectId): Promise<IProduct[]>;
  getTopRated(limit?: number): Promise<IProduct[]>;
}

/**
 * Product schema definition
 */
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    numReviews: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: '/images/default-product.jpg'
    },
    ingredients: [
      {
        type: String,
        trim: true
      }
    ],
    allergens: [
      {
        type: String,
        trim: true
      }
    ],
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      default: false
    },
    nutrition: {
      calories: {
        type: Number,
        min: 0
      },
      protein: {
        type: Number,
        min: 0
      },
      carbs: {
        type: Number,
        min: 0
      },
      fat: {
        type: Number,
        min: 0
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for search and frequent queries
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ inStock: 1 });

// Static method to get featured products
ProductSchema.statics.getFeaturedProducts = function() {
  return this.find({ featured: true, inStock: true })
    .sort({ rating: -1 })
    .limit(8)
    .populate('category', 'name slug');
};

// Static method to find products by category
ProductSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, inStock: true })
    .sort({ name: 1 })
    .populate('category', 'name slug');
};

// Static method to get top rated products
ProductSchema.statics.getTopRated = function(limit = 5) {
  return this.find({ rating: { $gte: 4 }, inStock: true })
    .sort({ rating: -1 })
    .limit(limit)
    .populate('category', 'name slug');
};

/**
 * Create the Product model with static methods
 */
export default mongoose.model<IProduct, IProductModel>('Product', ProductSchema);
