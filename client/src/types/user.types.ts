// User profile and address management types
import { User } from './auth.types';

/**
 * Address model for user profile
 */
export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  recipientName: string;
  streetAddress: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  state?: string;
  country: string;
  phoneNumber: string;
  deliveryInstructions?: string;
}

/**
 * Extended user profile information
 */
export interface UserProfile extends User {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  addresses: Address[];
  preferredLanguage?: 'fr' | 'en';
  marketingConsent?: boolean;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User profile update request payload
 */
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  preferredLanguage?: 'fr' | 'en';
  marketingConsent?: boolean;
  birthDate?: string;
}

/**
 * Address creation/update request payload
 */
export interface AddressRequest {
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
  recipientName: string;
  streetAddress: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  state?: string;
  country: string;
  phoneNumber: string;
  deliveryInstructions?: string;
}
