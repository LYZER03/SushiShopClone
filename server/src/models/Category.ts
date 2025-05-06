import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing a category document in MongoDB
 */
export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for Category model with static methods
 */
interface ICategoryModel extends Model<ICategory> {
  getActiveCategories(): Promise<ICategory[]>;
}

/**
 * Category schema definition
 */
const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
      unique: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true, // Explicitly set index to true for clarity
      // Not marked as required since it's auto-generated if not provided
    },
    imageUrl: {
      type: String,
      default: '/images/default-category.jpg'
    },
    active: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for performance
// Name and slug uniqueness are already enforced in the schema definition
// Only add compound indexes that can't be defined at the field level
CategorySchema.index({ active: 1, sortOrder: 1 }); // Compound index for category listing

// Pre-save hook to automatically generate slug if not provided
CategorySchema.pre('save', function(this: ICategory & Document, next) {
  // If it's a new document OR name was modified but slug is empty
  if (this.isNew || (this.isModified('name') && !this.slug)) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Define category static methods
CategorySchema.statics.getActiveCategories = function() {
  return this.find({ active: true }).sort({ sortOrder: 1 });
};

// Virtual for products (will be populated when needed)
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

/**
 * Create and export the Category model
 */
export default mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);
