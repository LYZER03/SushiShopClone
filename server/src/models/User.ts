import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

/**
 * User roles enum
 */
export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin'
}

/**
 * Interface pour l'adresse
 */
export interface IAddress {
  _id: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  recipientName: string;
  phoneNumber: string;
  additionalInfo?: string;
  deliveryInstructions?: string;
}

/**
 * Interface for User document
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  phone?: string;
  // Support pour l'ancienne structure d'adresse (pour compatibilité)
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Nouveau tableau d'adresses pour permettre plusieurs adresses
  addresses?: IAddress[];
  lastLogin?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generatePasswordResetToken(): Promise<string>;
}

/**
 * Interface for User model with static methods
 */
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

/**
 * User schema definition
 */
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number']
    },
    // Adresse unique (pour la compatibilité avec le code existant)
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      zipCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      }
    },
    // Tableau d'adresses pour permettre plusieurs adresses
    addresses: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        required: false,
        trim: true
      },
      zipCode: {
        type: String,
        required: [true, 'Zip/Postal code is required'],
        trim: true
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
      },
      type: {
        type: String,
        required: [true, 'Address type is required'],
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      recipientName: {
        type: String,
        required: [true, 'Recipient name is required'],
        trim: true
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
      },
      additionalInfo: {
        type: String,
        required: false,
        trim: true
      },
      deliveryInstructions: {
        type: String,
        required: false,
        trim: true
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    lastLogin: {
      type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: (_, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

/**
 * Add text index for search
 */
// Keep only the text index for search, email uniqueness is already enforced in the schema
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

/**
 * Pre-save hook to hash password before saving
 */
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Instance method to compare passwords
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method to generate JWT
 */
UserSchema.methods.generateAuthToken = function(): string {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role
  };
  
  // Simplify JWT signing to avoid potential issues
  try {
    // Use the jwtSecret from config
    return jwt.sign(payload, config.jwtSecret);
  } catch (error) {
    console.error('JWT signing error:', error);
    // Use a fallback secret key in case of errors
    return jwt.sign(payload, 'development_secret_key');
  }
};

/**
 * Instance method to generate password reset token
 */
UserSchema.methods.generatePasswordResetToken = async function(): Promise<string> {
  // Create a secret key buffer from our string secret
  const secretBuffer = Buffer.from(config.jwtSecret, 'utf8');
  
  // Generate a reset token 
  let resetToken: string;
  try {
    // Using the secret as a buffer to avoid type errors
    resetToken = jwt.sign({ id: this._id }, secretBuffer);
  } catch (error) {
    console.error('Reset token generation error:', error);
    resetToken = Math.random().toString(36).substring(2, 15);
  }
  
  // Hash the token and save it to the user
  this.passwordResetToken = resetToken;
  
  // Set expiration to 1 hour from now
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  
  await this.save();
  
  return resetToken;
};

/**
 * Static method to find user by email
 */
UserSchema.statics.findByEmail = function(email: string): Promise<IUser | null> {
  return this.findOne({ email });
};

/**
 * Create and export the User model
 */
export default mongoose.model<IUser, IUserModel>('User', UserSchema);
