import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/layout';
import { FormControl } from '@chakra-ui/form-control';
import { FormLabel } from '@chakra-ui/form-control';
import { FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Select } from '@chakra-ui/select';
import { Textarea } from '@chakra-ui/textarea';
import { Checkbox } from '@chakra-ui/checkbox';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';

import { Address, AddressRequest } from '../../types/user.types';

interface AddressFormProps {
  address?: Address;
  onSubmit: (addressData: AddressRequest) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Reusable address form component for creating and updating addresses
 * Provides validation and formatted inputs for address data
 */
const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState<AddressRequest>({
    type: 'home',
    isDefault: false,
    recipientName: '',
    streetAddress: '',
    additionalInfo: '',
    postalCode: '',
    city: '',
    state: '',
    country: 'France',
    phoneNumber: '',
    deliveryInstructions: '',
  });
  
  // Set initial form data when editing an existing address
  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type,
        isDefault: address.isDefault,
        recipientName: address.recipientName,
        streetAddress: address.streetAddress,
        additionalInfo: address.additionalInfo || '',
        postalCode: address.postalCode,
        city: address.city,
        state: address.state || '',
        country: address.country,
        phoneNumber: address.phoneNumber,
        deliveryInstructions: address.deliveryInstructions || '',
      });
    }
  }, [address]);
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Invalid postal code format (5 digits required)';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+\d{1,3})?[\s-]?\d{9,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const success = await onSubmit(formData);
      
      if (success) {
        toast({
          title: address ? 'Address Updated' : 'Address Added',
          description: address 
            ? 'Your address has been updated successfully'
            : 'Your new address has been added successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error submitting address form:', error);
      toast({
        title: 'Error',
        description: 'There was an error processing your request',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="start">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          {/* Recipient Name */}
          <FormControl isRequired isInvalid={!!errors.recipientName}>
            <FormLabel>Nom du destinataire</FormLabel>
            <Input
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Nom complet"
            />
            <FormErrorMessage>{errors.recipientName}</FormErrorMessage>
          </FormControl>
          
          {/* Phone Number */}
          <FormControl isRequired isInvalid={!!errors.phoneNumber}>
            <FormLabel>Numéro de téléphone</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="ex: 0612345678"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          
          {/* Street Address */}
          <FormControl isRequired isInvalid={!!errors.streetAddress} gridColumn={{ md: 'span 2' }}>
            <FormLabel>Adresse</FormLabel>
            <Input
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Numéro et nom de la rue"
            />
            <FormErrorMessage>{errors.streetAddress}</FormErrorMessage>
          </FormControl>
          
          {/* Additional Info */}
          <FormControl gridColumn={{ md: 'span 2' }}>
            <FormLabel>Complément d'adresse</FormLabel>
            <Input
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Appartement, bâtiment, étage, etc."
            />
          </FormControl>
          
          {/* Postal Code */}
          <FormControl isRequired isInvalid={!!errors.postalCode}>
            <FormLabel>Code postal</FormLabel>
            <Input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="ex: 75000"
            />
            <FormErrorMessage>{errors.postalCode}</FormErrorMessage>
          </FormControl>
          
          {/* City */}
          <FormControl isRequired isInvalid={!!errors.city}>
            <FormLabel>Ville</FormLabel>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="ex: Paris"
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          
          {/* State/Region (Optional for France) */}
          <FormControl>
            <FormLabel>Région</FormLabel>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Optionnel"
            />
          </FormControl>
          
          {/* Country */}
          <FormControl isRequired isInvalid={!!errors.country}>
            <FormLabel>Pays</FormLabel>
            <Select name="country" value={formData.country} onChange={handleChange}>
              <option value="France">France</option>
              <option value="Belgium">Belgique</option>
              <option value="Switzerland">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
            </Select>
            <FormErrorMessage>{errors.country}</FormErrorMessage>
          </FormControl>
          
          {/* Address Type */}
          <FormControl isRequired>
            <FormLabel>Type d'adresse</FormLabel>
            <Select name="type" value={formData.type} onChange={handleChange}>
              <option value="home">Domicile</option>
              <option value="work">Travail</option>
              <option value="other">Autre</option>
            </Select>
          </FormControl>
          
          {/* Delivery Instructions */}
          <FormControl gridColumn={{ md: 'span 2' }}>
            <FormLabel>Instructions de livraison</FormLabel>
            <Textarea
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              placeholder="Instructions spéciales pour la livraison (code d'entrée, digicode, etc.)"
              rows={3}
            />
          </FormControl>
          
          {/* Set as Default Address */}
          <FormControl gridColumn={{ md: 'span 2' }}>
            <Checkbox
              name="isDefault"
              isChecked={formData.isDefault}
              onChange={handleCheckboxChange}
              colorScheme="primary"
            >
              Définir comme adresse par défaut
            </Checkbox>
          </FormControl>
        </SimpleGrid>
        
        {/* Form Actions */}
        <Box display="flex" justifyContent="flex-end" width="100%" pt={4} gap={4}>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            colorScheme="primary"
            isLoading={isSubmitting}
            loadingText={address ? 'Mise à jour...' : 'Ajout...'}
          >
            {address ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default AddressForm;
