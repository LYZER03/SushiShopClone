import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserProfile, Address, ProfileUpdateRequest, AddressRequest } from '../types/user.types';
import userApi from '../api/user';

/**
 * State for user profile management
 */
interface UserProfileState {
  // Profile state
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Addresses
  addresses: Address[];
  selectedAddress: Address | null;
  
  // Profile actions
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<boolean>;
  clearProfileError: () => void;
  
  // Address actions
  fetchAddresses: () => Promise<Address[]>;
  getAddressById: (id: string) => Address | undefined;
  createAddress: (address: AddressRequest) => Promise<boolean>;
  updateAddress: (id: string, address: AddressRequest) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
  setSelectedAddress: (address: Address | null) => void;
}

/**
 * Zustand store for user profile management
 * Handles user profile data, addresses, and related operations
 */
const useUserProfileStore = create<UserProfileState>()(
  devtools(
    (set, get) => ({
      // Initial state
      profile: null,
      addresses: [],
      selectedAddress: null,
      isLoading: false,
      error: null,
      
      /**
       * Fetch user profile from API
       */
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.getProfile();
          const profileData = response.data.data || response.data;
          
          set({
            profile: profileData,
            isLoading: false,
          });
          
          return profileData;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to fetch profile data';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return null;
        }
      },
      
      /**
       * Update user profile information
       */
      updateProfile: async (data: ProfileUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.updateProfile(data);
          const updatedProfile = response.data.data || response.data;
          
          set({
            profile: {
              ...get().profile,
              ...updatedProfile,
            } as UserProfile,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to update profile';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Clear profile error state
       */
      clearProfileError: () => {
        set({ error: null });
      },
      
      /**
       * Fetch user addresses from API
       */
      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.getAddresses();
          const addresses = response.data.data || response.data;
          
          set({
            addresses,
            isLoading: false,
          });
          
          // If there's a default address, select it
          const defaultAddress = addresses.find((address: Address) => address.isDefault);
          if (defaultAddress && !get().selectedAddress) {
            set({ selectedAddress: defaultAddress });
          }
          
          return addresses;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to fetch addresses';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return [];
        }
      },
      
      /**
       * Get address by ID from local state
       */
      getAddressById: (id: string) => {
        return get().addresses.find(address => address.id === id);
      },
      
      /**
       * Create a new address
       */
      createAddress: async (addressData: AddressRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.createAddress(addressData);
          const newAddress = response.data.data || response.data;
          
          // Update addresses list
          const updatedAddresses = [...get().addresses, newAddress];
          set({
            addresses: updatedAddresses,
            isLoading: false,
          });
          
          // If it's the default address or the first address, select it
          if (addressData.isDefault || updatedAddresses.length === 1) {
            set({ selectedAddress: newAddress });
          }
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to create address';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Update an existing address
       */
      updateAddress: async (id: string, addressData: AddressRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.updateAddress(id, addressData);
          const updatedAddress = response.data.data || response.data;
          
          // Update addresses list
          const updatedAddresses = get().addresses.map(address => 
            address.id === id ? updatedAddress : address
          );
          
          set({
            addresses: updatedAddresses,
            isLoading: false,
          });
          
          // Update selected address if it was the one modified
          if (get().selectedAddress?.id === id) {
            set({ selectedAddress: updatedAddress });
          }
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to update address';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Delete an address
       */
      deleteAddress: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await userApi.deleteAddress(id);
          
          // Update addresses list
          const updatedAddresses = get().addresses.filter(address => 
            address.id !== id
          );
          
          set({
            addresses: updatedAddresses,
            isLoading: false,
          });
          
          // If the deleted address was selected, clear selection
          if (get().selectedAddress?.id === id) {
            // Find a new default address if available
            const newDefault = updatedAddresses.find(address => address.isDefault);
            set({ selectedAddress: newDefault || null });
          }
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to delete address';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Set an address as default
       */
      setDefaultAddress: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await userApi.setDefaultAddress(id);
          
          // Update addresses list to reflect new default status
          const updatedAddresses = get().addresses.map(address => ({
            ...address,
            isDefault: address.id === id
          }));
          
          // Find the new default address
          const defaultAddress = updatedAddresses.find(address => address.id === id);
          
          set({
            addresses: updatedAddresses,
            selectedAddress: defaultAddress || get().selectedAddress,
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
            'Failed to set default address';
            
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          return false;
        }
      },
      
      /**
       * Set the selected address for checkout or other operations
       */
      setSelectedAddress: (address: Address | null) => {
        set({ selectedAddress: address });
      },
    })
  )
);

export default useUserProfileStore;
