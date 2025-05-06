import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import { Alert } from '@chakra-ui/alert';
import { AlertIcon } from '@chakra-ui/alert';
import { AlertTitle } from '@chakra-ui/alert';
import { AlertDescription } from '@chakra-ui/alert';
import { Card } from '@chakra-ui/card';
import { CardHeader } from '@chakra-ui/card';
import { CardBody } from '@chakra-ui/card';
import { useDisclosure } from '@chakra-ui/hooks';
import { Icon } from '@chakra-ui/icon';
import { FiUser, FiMapPin, FiShoppingBag, FiPlusCircle } from 'react-icons/fi';

import ProfileForm from '../components/profile/ProfileForm';
import AddressForm from '../components/profile/AddressForm';
import AddressList from '../components/profile/AddressList';
import OrderHistory from '../components/profile/OrderHistory';
import useAuthStore from '../stores/authStore';
import useUserProfileStore from '../stores/userProfileStore';
import useOrderStore from '../stores/orderStore';
import { AddressRequest } from '../types/user.types';

/**
 * ProfilePage component for user profile management
 * Provides tabs for personal information, addresses, and order history
 * Integrates with userProfileStore and authStore for data management
 */
const ProfilePage: React.FC = () => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // UI state for address form
  const { isOpen: isAddressFormOpen, onOpen: openAddressForm, onClose: closeAddressForm } = useDisclosure();
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  // Get auth state
  const { user, isAuthenticated } = useAuthStore();
  
  // Get profile data and actions
  const {
    profile,
    addresses,
    isLoading: profileIsLoading,
    error: profileError,
    fetchProfile,
    updateProfile,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUserProfileStore();
  
  // Get order data and actions
  const { isLoading: ordersIsLoading } = useOrderStore();
  
  // Combined loading and error states
  const isLoading = profileIsLoading || ordersIsLoading;
  const error = profileError;
  
  // Load profile and addresses data
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
      fetchAddresses();
    }
  }, [isAuthenticated, user, fetchProfile, fetchAddresses]);
  
  // Handle address form submission
  const handleAddressSubmit = async (addressData: AddressRequest) => {
    if (editingAddress) {
      // Update existing address
      const success = await updateAddress(editingAddress.id, addressData);
      if (success) {
        setEditingAddress(null);
        closeAddressForm();
      }
      return success;
    } else {
      // Create new address
      const success = await createAddress(addressData);
      if (success) {
        closeAddressForm();
      }
      return success;
    }
  };
  
  // Handle address edit button
  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    openAddressForm();
  };
  
  // Handle add new address button
  const handleAddNewAddress = () => {
    setEditingAddress(null);
    openAddressForm();
  };
  
  // Tab data with icons
  const tabs = [
    { label: 'Informations', id: 'personal-info', icon: FiUser },
    { label: 'Adresses', id: 'addresses', icon: FiMapPin },
    { label: 'Commandes', id: 'orders', icon: FiShoppingBag },
  ];

  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Accès restreint</AlertTitle>
          <AlertDescription>Vous devez vous connecter pour accéder à votre profil</AlertDescription>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} width="100%" align="stretch">
        <Flex direction="column" gap={2}>
          <Heading as="h1" size="xl">
            Mon Profil
          </Heading>
          {user && (
            <Text color="gray.600">
              Bienvenue, {user.firstName} {user.lastName}
            </Text>
          )}
        </Flex>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading && !profile && (
          <Flex justify="center" py={10}>
            <Spinner size="xl" color="primary.500" thickness="4px" />
          </Flex>
        )}
        
        {profile && (
          <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
            {/* Custom Tab List */}
            <Flex 
              px={4} 
              pt={4} 
              gap={2} 
              borderBottom="1px solid" 
              borderColor="gray.200"
              overflowX="auto"
              flexWrap={{ base: 'nowrap', md: 'wrap' }}
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === index ? 'solid' : 'ghost'}
                    colorScheme={activeTab === index ? 'primary' : 'gray'}
                    onClick={() => setActiveTab(index)}
                    mb={2}
                    borderRadius="md"
                    leftIcon={<Icon />}
                    minW="120px"
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Flex>
            
            {/* Custom Tab Panels */}
            <Box p={{ base: 4, md: 6 }}>
              {/* Personal Info Panel */}
              {activeTab === 0 && (
                <Box>
                  <Heading as="h2" size="md" mb={6}>Mes informations personnelles</Heading>
                  <ProfileForm 
                    profile={profile} 
                    onSubmit={updateProfile} 
                    isSubmitting={isLoading} 
                  />
                </Box>
              )}
              
              {/* Addresses Panel */}
              {activeTab === 1 && (
                <Box>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading as="h2" size="md">Mes adresses</Heading>
                    <Button
                      leftIcon={<FiPlusCircle />}
                      colorScheme="primary"
                      variant="outline"
                      onClick={handleAddNewAddress}
                    >
                      Ajouter une adresse
                    </Button>
                  </Flex>
                  
                  {/* Address Form (shown when adding/editing) */}
                  {isAddressFormOpen && (
                    <Card mb={6} variant="outline" p={4}>
                      <CardHeader pb={2}>
                        <Heading size="md">
                          {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une nouvelle adresse'}
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <AddressForm
                          address={editingAddress}
                          onSubmit={handleAddressSubmit}
                          onCancel={closeAddressForm}
                          isSubmitting={isLoading}
                        />
                      </CardBody>
                    </Card>
                  )}
                  
                  {/* Address List */}
                  <AddressList
                    addresses={addresses}
                    onEdit={handleEditAddress}
                    onDelete={deleteAddress}
                    onSetDefault={setDefaultAddress}
                    isLoading={isLoading}
                  />
                </Box>
              )}
              
              {/* Order History Panel */}
              {activeTab === 2 && (
                <Box>
                  <Heading as="h2" size="md" mb={6}>Historique des commandes</Heading>
                  <OrderHistory 
                    autoFetch={true}
                    isLoading={ordersIsLoading}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ProfilePage;
