import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { IconButton } from '@chakra-ui/button';
import { Badge } from '@chakra-ui/layout';
import { Card } from '@chakra-ui/card';
import { CardBody } from '@chakra-ui/card';
import { CardFooter } from '@chakra-ui/card';
import { CardHeader } from '@chakra-ui/card';
import { Flex } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { AlertDialog } from '@chakra-ui/modal';
import { AlertDialogBody } from '@chakra-ui/modal';
import { AlertDialogContent } from '@chakra-ui/modal';
import { AlertDialogFooter } from '@chakra-ui/modal';
import { AlertDialogHeader } from '@chakra-ui/modal';
import { AlertDialogOverlay } from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import { useRef } from 'react';
import { FiHome, FiEdit2, FiTrash2, FiStar, FiBriefcase, FiMapPin } from 'react-icons/fi';

import { Address } from '../../types/user.types';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<boolean>;
  onSetDefault: (id: string) => Promise<boolean>;
  isLoading?: boolean;
}

/**
 * Address list component for displaying and managing user addresses
 * Provides functionality to edit, delete, and set default addresses
 */
const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [addressToDelete, setAddressToDelete] = React.useState<Address | null>(null);
  
  // Handle delete confirmation
  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    onOpen();
  };
  
  // Execute delete after confirmation
  const confirmDelete = async () => {
    if (addressToDelete) {
      await onDelete(addressToDelete.id);
      onClose();
    }
  };
  
  // Get icon based on address type
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <FiHome size={20} />;
      case 'work':
        return <FiBriefcase size={20} />;
      default:
        return <FiMapPin size={20} />;
    }
  };
  
  // Get address type label
  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Domicile';
      case 'work':
        return 'Travail';
      default:
        return 'Autre';
    }
  };
  
  if (addresses.length === 0) {
    return (
      <Card variant="outline" p={6} textAlign="center">
        <VStack spacing={4}>
          <Text>Vous n'avez pas encore ajouté d'adresse</Text>
        </VStack>
      </Card>
    );
  }
  
  return (
    <>
      <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={4}
        width="100%"
      >
        {addresses.map((address) => (
          <Card key={address.id} variant="outline" size="sm">
            <CardHeader pb={0}>
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={2}>
                  {getAddressIcon(address.type)}
                  <Heading size="sm">
                    {getAddressTypeLabel(address.type)}
                  </Heading>
                </Flex>
                {address.isDefault && (
                  <Badge colorScheme="primary" variant="solid" borderRadius="full" px={2}>
                    Par défaut
                  </Badge>
                )}
              </Flex>
            </CardHeader>
            
            <CardBody py={3}>
              <VStack align="stretch" spacing={1}>
                <Text fontWeight="medium">{address.recipientName}</Text>
                <Text fontSize="sm">{address.streetAddress}</Text>
                {address.additionalInfo && (
                  <Text fontSize="sm" color="gray.600">{address.additionalInfo}</Text>
                )}
                <Text fontSize="sm">
                  {address.postalCode} {address.city}
                  {address.state && `, ${address.state}`}
                </Text>
                <Text fontSize="sm">{address.country}</Text>
                <Text fontSize="sm" mt={1}>{address.phoneNumber}</Text>
                {address.deliveryInstructions && (
                  <>
                    <Divider my={2} />
                    <Text fontSize="xs" color="gray.600">
                      {address.deliveryInstructions}
                    </Text>
                  </>
                )}
              </VStack>
            </CardBody>
            
            <CardFooter pt={0}>
              <Flex width="100%" justifyContent="space-between">
                <Flex gap={2}>
                  <IconButton
                    aria-label="Edit address"
                    icon={<FiEdit2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(address)}
                  />
                  <IconButton
                    aria-label="Delete address"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDeleteClick(address)}
                  />
                </Flex>
                
                {!address.isDefault && (
                  <Button
                    leftIcon={<FiStar />}
                    size="sm"
                    variant="outline"
                    onClick={() => onSetDefault(address.id)}
                    isLoading={isLoading}
                  >
                    Par défaut
                  </Button>
                )}
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer l'adresse
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action ne peut pas être annulée.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={isLoading}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AddressList;
