import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Badge } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Accordion } from '@chakra-ui/accordion';
import { AccordionItem } from '@chakra-ui/accordion';
import { AccordionButton } from '@chakra-ui/accordion';
import { AccordionPanel } from '@chakra-ui/accordion';
import { AccordionIcon } from '@chakra-ui/accordion';
import { Table } from '@chakra-ui/table';
import { Thead } from '@chakra-ui/table';
import { Tbody } from '@chakra-ui/table';
import { Tr } from '@chakra-ui/table';
import { Th } from '@chakra-ui/table';
import { Td } from '@chakra-ui/table';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@chakra-ui/toast';
import { FiShoppingBag, FiClock, FiCheck, FiTruck, FiArchive } from 'react-icons/fi';

import { Order } from '../../types/order.types';
import useOrderStore from '../../stores/orderStore';

// Order status types and their properties
const orderStatus = {
  pending: {
    label: 'En attente',
    color: 'orange',
    icon: FiClock,
  },
  processing: {
    label: 'En préparation',
    color: 'blue',
    icon: FiShoppingBag,
  },
  shipped: {
    label: 'Expédié',
    color: 'purple',
    icon: FiTruck,
  },
  delivered: {
    label: 'Livré',
    color: 'green',
    icon: FiCheck,
  },
  cancelled: {
    label: 'Annulé',
    color: 'red',
    icon: FiArchive,
  },
};

// Helper function to get payment method label
const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'credit_card':
      return 'Carte bancaire';
    case 'paypal':
      return 'PayPal';
    case 'bank_transfer':
      return 'Virement bancaire';
    default:
      return method;
  }
};

interface OrderHistoryProps {
  orders?: Order[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  // If no orders are provided, component will fetch them from the store
  autoFetch?: boolean;
}

/**
 * Order history component for displaying past user orders
 * Shows order details, status, and allows navigation to order details
 */
const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders: propOrders,
  isLoading: propIsLoading,
  hasMore: propHasMore,
  onLoadMore: propOnLoadMore,
  autoFetch = true,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get orders from store if not provided via props
  const { 
    orders: storeOrders, 
    isLoading: storeIsLoading, 
    pagination,
    error,
    fetchOrders,
    cancelOrder,
    clearOrdersError
  } = useOrderStore();
  
  // Determine which data source to use
  const orders = propOrders || storeOrders;
  const isLoading = propIsLoading !== undefined ? propIsLoading : storeIsLoading;
  const hasMore = propHasMore !== undefined ? propHasMore : (pagination.currentPage < pagination.totalPages);
  const isFunctionalityInDevelopment = error && error.includes("sera disponible prochainement");
  
  // Auto fetch orders if needed
  useEffect(() => {
    if (autoFetch && !propOrders && orders.length === 0 && !isLoading) {
      fetchOrders();
    }
    
    // Clear error on unmount
    return () => {
      if (error) clearOrdersError();
    };
  }, [autoFetch, propOrders, orders.length, isLoading, fetchOrders, error, clearOrdersError]);
  
  // Show error if present
  useEffect(() => {
    if (error && !isFunctionalityInDevelopment) {
      toast({
        title: 'Erreur',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast, isFunctionalityInDevelopment]);

  // View detailed order page
  const handleViewOrder = (orderId: string) => {
    navigate(`/profile/orders/${orderId}`);
  };
  
  // Cancel an order
  const handleCancelOrder = async (orderId: string) => {
    const success = await cancelOrder(orderId);
    if (success) {
      toast({
        title: 'Commande annulée',
        description: 'Votre commande a été annulée avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Load more orders
  const handleLoadMore = () => {
    if (propOnLoadMore) {
      propOnLoadMore();
    } else if (!isLoading && hasMore) {
      fetchOrders(pagination.currentPage + 1, pagination.limit);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  if (isFunctionalityInDevelopment) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={6}
        textAlign="center"
        bg="blue.50"
      >
        <FiClock size={40} style={{ margin: '0 auto 1rem', color: '#4299E1' }} />
        <Text fontWeight="medium" mb={2}>Fonctionnalité en développement</Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          L'historique des commandes sera disponible dans une prochaine mise à jour.
        </Text>
        <Text fontSize="sm" color="blue.600" mb={4}>
          Nos développeurs travaillent activement sur cette fonctionnalité.
        </Text>
        <Button
          colorScheme="primary"
          size="sm"
          onClick={() => navigate('/menu')}
        >
          Découvrir nos produits
        </Button>
      </Box>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={6}
        textAlign="center"
        bg="gray.50"
      >
        <FiShoppingBag size={40} style={{ margin: '0 auto 1rem' }} />
        <Text fontWeight="medium" mb={2}>Aucune commande trouvée</Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Vous n'avez pas encore passé de commande
        </Text>
        <Button
          colorScheme="primary"
          size="sm"
          onClick={() => navigate('/menu')}
        >
          Découvrir nos produits
        </Button>
      </Box>
    );
  }
  
  return (
    <Box width="100%">
      <Accordion allowMultiple defaultIndex={[0]}>
        {orders.map((order) => {
          const status = orderStatus[order.status];
          
          return (
            <AccordionItem key={order.id} mb={4} borderWidth="1px" borderRadius="md" overflow="hidden">
              <h2>
                <AccordionButton py={4} _hover={{ bg: 'gray.50' }}>
                  <Box flex="1" textAlign="left">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Flex align="center" gap={3}>
                        {React.createElement(status.icon, { size: 18 })}
                        <Text fontWeight="medium">
                          Commande #{order.orderNumber}
                        </Text>
                        <Badge colorScheme={status.color}>
                          {status.label}
                        </Badge>
                      </Flex>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(order.createdAt)}
                      </Text>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              
              <AccordionPanel pb={4}>
                <Box>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontWeight="medium">Articles</Text>
                    <Text fontWeight="bold">{order.total.toFixed(2)} €</Text>
                  </Flex>
                  
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Produit</Th>
                        <Th isNumeric>Qté</Th>
                        <Th isNumeric>Prix</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.items.map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.name}</Td>
                          <Td isNumeric>{item.quantity}</Td>
                          <Td isNumeric>{item.price.toFixed(2)} €</Td>
                          <Td isNumeric>{(item.price * item.quantity).toFixed(2)} €</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  
                  <Divider my={4} />
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontWeight="medium" mb={2}>Adresse de livraison</Text>
                      <Text fontSize="sm">{order.shippingAddress.recipientName}</Text>
                      <Text fontSize="sm">{order.shippingAddress.streetAddress}</Text>
                      <Text fontSize="sm">
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      </Text>
                      <Text fontSize="sm">{order.shippingAddress.country}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="medium" mb={2}>Détails de paiement</Text>
                      <Text fontSize="sm">Méthode: {getPaymentMethodLabel(order.payment.method)}</Text>
                      {order.trackingNumber && (
                        <>
                          <Text fontWeight="medium" mt={3} mb={1}>Suivi</Text>
                          <Text fontSize="sm">Numéro de suivi: {order.trackingNumber}</Text>
                        </>
                      )}
                    </Box>
                  </SimpleGrid>
                  
                  <Flex justify="flex-end" mt={4}>
                    <Flex gap={2}>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          variant="outline"
                          colorScheme="red"
                        >
                          Annuler
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleViewOrder(order.id)}
                        variant="outline"
                      >
                        Voir les détails
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      
      {hasMore && (
        <Flex justify="center" mt={6}>
          <Button
            onClick={handleLoadMore}
            isLoading={isLoading}
            loadingText="Chargement..."
            variant="outline"
          >
            Charger plus de commandes
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default OrderHistory;
