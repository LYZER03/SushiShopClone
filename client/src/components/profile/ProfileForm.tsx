import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/layout';
import { FormControl } from '@chakra-ui/form-control';
import { FormLabel } from '@chakra-ui/form-control';
import { FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { FormHelperText } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { Text } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';

import { UserProfile, ProfileUpdateRequest } from '../../types/user.types';

interface ProfileFormProps {
  profile: UserProfile | null;
  onSubmit: (data: ProfileUpdateRequest) => Promise<boolean>;
  isSubmitting?: boolean;
}

/**
 * User profile edit form component
 * Allows users to update their personal information
 */
const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isSubmitting = false,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredLanguage: 'fr',
    marketingConsent: false,
    birthDate: '',
  });
  
  // Set initial form data when profile data is available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber || '',
        preferredLanguage: profile.preferredLanguage || 'fr',
        marketingConsent: profile.marketingConsent || false,
        birthDate: profile.birthDate || '',
      });
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  
  // Handle checkbox and switch changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    // Phone number format validation (if provided)
    if (formData.phoneNumber && !/^(\+\d{1,3})?[\s-]?\d{9,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Format de numéro de téléphone invalide';
    }
    
    // Birth date validation (if provided)
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const now = new Date();
      const minAge = 13; // Minimum age requirement
      const minDate = new Date(
        now.getFullYear() - minAge,
        now.getMonth(),
        now.getDate()
      );
      
      if (isNaN(birthDate.getTime())) {
        newErrors.birthDate = 'Format de date invalide';
      } else if (birthDate > now) {
        newErrors.birthDate = 'La date ne peut pas être dans le futur';
      } else if (birthDate > minDate) {
        newErrors.birthDate = `Vous devez avoir au moins ${minAge} ans`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire',
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
          title: 'Profil mis à jour',
          description: 'Vos informations ont été mises à jour avec succès',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour de votre profil',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  if (!profile) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Chargement des informations du profil...</Text>
      </Box>
    );
  }
  
  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="start" width="100%">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
          {/* First Name */}
          <FormControl isRequired isInvalid={!!errors.firstName}>
            <FormLabel>Prénom</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Votre prénom"
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>
          
          {/* Last Name */}
          <FormControl isRequired isInvalid={!!errors.lastName}>
            <FormLabel>Nom</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Votre nom"
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
          
          {/* Email (read-only) */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={profile.email}
              isReadOnly
              bg="gray.50"
              cursor="not-allowed"
            />
            <FormHelperText>
              L'email ne peut pas être modifié directement
            </FormHelperText>
          </FormControl>
          
          {/* Phone Number */}
          <FormControl isInvalid={!!errors.phoneNumber}>
            <FormLabel>Numéro de téléphone</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="ex: 0612345678"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          
          {/* Birth Date */}
          <FormControl isInvalid={!!errors.birthDate}>
            <FormLabel>Date de naissance</FormLabel>
            <Input
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
            <FormHelperText>
              Utilisée pour les offres spéciales anniversaire
            </FormHelperText>
            <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
          </FormControl>
          
          {/* Preferred Language */}
          <FormControl>
            <FormLabel>Langue préférée</FormLabel>
            <Select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </Select>
          </FormControl>
        </SimpleGrid>
        
        {/* Marketing Consent */}
        <FormControl display="flex" alignItems="center" py={4}>
          <Switch
            id="marketing-consent"
            colorScheme="primary"
            isChecked={formData.marketingConsent}
            onChange={(e) => handleToggleChange('marketingConsent', e.target.checked)}
            mr={3}
          />
          <FormLabel htmlFor="marketing-consent" mb={0}>
            Je souhaite recevoir des emails concernant les promotions et nouvelles offres
          </FormLabel>
        </FormControl>
        
        {/* Account Creation Date */}
        {profile.createdAt && (
          <Text fontSize="sm" color="gray.500">
            Membre depuis {new Date(profile.createdAt).toLocaleDateString()}
          </Text>
        )}
        
        {/* Submit Button */}
        <Box width="100%" display="flex" justifyContent="flex-end" mt={4}>
          <Button
            type="submit"
            colorScheme="primary"
            isLoading={isSubmitting}
            loadingText="Mise à jour..."
          >
            Enregistrer les modifications
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfileForm;
