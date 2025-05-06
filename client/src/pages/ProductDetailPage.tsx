import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/layout';
import { GridItem } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Badge } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { Button } from '@chakra-ui/button';
import { IconButton } from '@chakra-ui/button';
import { Icon } from '@chakra-ui/icon';
import { useColorMode } from '@chakra-ui/color-mode';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import useProductStore from '../stores/productStore';
import useCartStore from '../stores/cartStore';
import { ProductTag } from '../types/product.types';
import Breadcrumb, { generateBreadcrumbs } from '../components/navigation/Breadcrumb';
import CartSidebar from '../components/cart/CartSidebar';
import useCartSidebar from '../hooks/useCartSidebar';

/**
 * ProductDetailPage displays detailed information about a specific product
 * Enhanced with motion animations and improved UI
 */
const ProductDetailPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode } = useColorMode();
  
  // Get store data first
  const { fetchProductById, selectedProduct, isLoading, error } = useProductStore();
  const { addItem } = useCartStore();
  
  // Cart sidebar state
  const { isOpen, openSidebar, closeSidebar } = useCartSidebar();
  
  // State for quantity selection
  const [quantity, setQuantity] = useState(1);
  
  // Custom notification state to replace useToast
  const [notification, setNotification] = useState<{
    title: string;
    description: string;
    isVisible: boolean;
  } | null>(null);
  
  // Generate breadcrumb items based on product data
  const breadcrumbItems = generateBreadcrumbs(location.pathname, {
    menu: 'Menu',
    products: 'Products',
    [id || '']: selectedProduct?.name || 'Product Details'
  });
  
  // Handle increasing quantity
  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)); // Limit to 10 items
  };
  
  // Handle decreasing quantity
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Minimum 1 item
  };
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  // Fetch product data
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);
  
  // Handle adding to cart with animation feedback
  const handleAddToCart = () => {
    if (selectedProduct) {
      const defaultImage = selectedProduct.images.find(img => img.isDefault) || selectedProduct.images[0];
      
      // Add to cart with selected quantity
      addItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        imageUrl: defaultImage?.url,
      }, quantity); 
      
      // Show the notification with more details
      setNotification({
        title: 'Added to cart',
        description: `${quantity} × ${selectedProduct.name} added to your cart.`,
        isVisible: true
      });
      
      // Open the cart sidebar
      openSidebar();
      
      // Reset quantity after adding to cart
      setQuantity(1);
      
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  

  
  // Function to get tag color
  const getTagColor = (tag: ProductTag): string => {
    switch (tag) {
      case 'popular':
        return 'red';
      case 'new':
        return 'green';
      case 'spicy':
        return 'orange';
      case 'vegetarian':
        return 'teal';
      case 'gluten-free':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  // Error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box
          bg="red.100"
          p={4}
          borderRadius="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <Text fontSize="lg" fontWeight="bold" color="red.500" mt={4} mb={1}>
            {error}
          </Text>
          <Button 
            mt={4} 
            colorScheme="primary" 
            onClick={() => navigate('/menu')}
          >
            Return to Menu
          </Button>
        </Box>
      </Container>
    );
  }
  
  // Render notification with animation
  const renderNotification = () => {
    return (
      <AnimatePresence>
        {notification?.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10,
            }}
          >
            <Flex
              bg={colorMode === 'light' ? 'green.100' : 'green.800'}
              color={colorMode === 'light' ? 'green.800' : 'green.100'}
              p={4}
              borderRadius="md"
              boxShadow="md"
              borderLeft="4px solid"
              borderColor="green.500"
              align="center"
            >
              <Icon as={FiShoppingCart} mr={3} color="green.500" />
              <Box>
                <Heading as="h3" size="sm">{notification?.title}</Heading>
                <Text mt={1}>{notification?.description}</Text>
              </Box>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Container maxW="container.xl" py={8}>
        {renderNotification()}
        
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
        >
          <Breadcrumb items={breadcrumbItems} />
        </motion.div>
      
      <Grid 
        templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
        gap={8}
      >
        {/* Product Image */}
        <GridItem>
          {!isLoading && !!selectedProduct ? (
            <Box 
              borderRadius="lg" 
              overflow="hidden" 
              borderWidth="1px"
              borderColor="gray.200"
            >
              {(selectedProduct?.images.find(img => img.isDefault)?.url || selectedProduct?.images[0]?.url) ? (
                <Image
                  src={selectedProduct?.images.find(img => img.isDefault)?.url || selectedProduct?.images[0]?.url}
                  alt={selectedProduct?.name}
                  objectFit="cover"
                  width="100%"
                  height={{ base: '300px', md: '400px' }}
                />
              ) : (
                <Image
                  src="https://via.placeholder.com/600x400?text=Sushi"
                  alt="Placeholder"
                  objectFit="cover"
                  width="100%"
                  height={{ base: '300px', md: '400px' }}
                />
              )}
            </Box>
          ) : (
            <Box 
              borderRadius="lg" 
              overflow="hidden" 
              borderWidth="1px"
              borderColor="gray.200"
              bg="gray.100"
              height={{ base: '300px', md: '400px' }}
            />
          )}
        </GridItem>
        
        {/* Product Info */}
        <GridItem>
          <Flex direction="column" gap="6">
            {/* Name and Tags */}
            <Box>
              {!isLoading && !!selectedProduct ? (
                <Heading as="h1" size="xl">
                  {selectedProduct.name}
                </Heading>
              ) : (
                <Box width="100%" height="20px" bg="gray.200" />
              )}
              
              {!isLoading && !!selectedProduct ? (
                  <Flex gap={2} mt={2} flexWrap="wrap">
                    {selectedProduct?.tags.map((tag) => (
                      <Badge
                        key={tag}
                        colorScheme={getTagColor(tag)}
                        variant="solid"
                        px={2}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                ) : null}
            </Box>
            
            {/* Price and Rating */}
            <Flex 
              justify="space-between" 
              align="center"
              borderY="1px"
              borderColor="gray.200"
              py={4}
            >
              {!isLoading && !!selectedProduct ? (
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  ${selectedProduct?.price.toFixed(2)}
                </Text>
              ) : (
                <Box width="100px" height="28px" bg="gray.200" borderRadius="md" />
              )}
              
              {!isLoading && !!selectedProduct ? (
                selectedProduct?.rating && (
                  <Flex align="center">
                    <Box color="primary.400" mr={1}>
                      <svg
                        fill="currentColor"
                        width="16px"
                        height="16px"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </Box>
                    <Text fontWeight="medium">
                      {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                    </Text>
                  </Flex>
                )
              ) : (
                <Box width="150px" height="24px" bg="gray.200" borderRadius="md" />
              )}
            </Flex>
            
            {/* Description */}
            <Box>
              {!isLoading && !!selectedProduct ? (
                <Text fontSize="md" color="gray.700" lineHeight="tall">
                  {selectedProduct?.description}
                </Text>
              ) : (
                <Box width="100%" height="80px" bg="gray.200" borderRadius="md" />
              )}
            </Box>
            
            {/* Ingredients */}
            <Box>
              <Heading as="h3" size="sm" mb={2}>
                Ingredients
              </Heading>
              {!isLoading && !!selectedProduct ? (
                <Flex gap={2} flexWrap="wrap">
                  {selectedProduct?.ingredients.map((ingredient, index) => (
                    <Badge
                      key={index}
                      colorScheme="gray"
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </Flex>
              ) : (
                <Flex gap={2} flexWrap="wrap">
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} width="80px" height="24px" bg="gray.200" borderRadius="md" />
                  ))}
                </Flex>
              )}
            </Box>
            
            {/* Allergens if any */}
            {selectedProduct?.allergens && selectedProduct.allergens.length > 0 && (
              <Box>
                <Heading as="h3" size="sm" mb={2} color="red.500">
                  Allergens
                </Heading>
                {!isLoading && !!selectedProduct ? (
                  <Flex gap={2} flexWrap="wrap">
                    {selectedProduct.allergens.map((allergen, index) => (
                      <Badge
                        key={index}
                        colorScheme="red"
                        variant="subtle"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {allergen}
                      </Badge>
                    ))}
                  </Flex>
                ) : (
                  <Flex gap={2} flexWrap="wrap">
                    {[1, 2].map((i) => (
                      <Box key={i} width="80px" height="24px" bg="gray.200" borderRadius="md" />
                    ))}
                  </Flex>
                )}
              </Box>
            )}
            
            {/* Nutritional Info */}
            {selectedProduct?.nutritionalInfo && (
              <Box>
                <Heading as="h3" size="sm" mb={2}>
                  Nutritional Information
                </Heading>
                {!isLoading && !!selectedProduct ? (
                  <Grid 
                    templateColumns="repeat(2, 1fr)" 
                    gap={4}
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                  >
                    <Box>
                      <Text fontSize="sm" color="gray.500">Calories</Text>
                      <Text fontWeight="bold">{selectedProduct.nutritionalInfo.calories} kcal</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Protein</Text>
                      <Text fontWeight="bold">{selectedProduct.nutritionalInfo.protein}g</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Carbs</Text>
                      <Text fontWeight="bold">{selectedProduct.nutritionalInfo.carbs}g</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Fat</Text>
                      <Text fontWeight="bold">{selectedProduct.nutritionalInfo.fat}g</Text>
                    </Box>
                  </Grid>
                ) : (
                  <Box width="100%" height="160px" bg="gray.200" borderRadius="md" />
                )}
              </Box>
            )}
            
            {/* Quantity Select and Add to Cart */}
            {!isLoading && !!selectedProduct ? (
              <Box>
                {/* Quantity Controls */}
                <Flex align="center" justify="space-between" mb={4}>
                  <Text fontWeight="medium">Quantity:</Text>
                  <Flex align="center">
                    <IconButton
                      aria-label="Decrease quantity"
                      icon={<FiMinus />}
                      size="sm"
                      isRound
                      variant="outline"
                      onClick={decreaseQuantity}
                      isDisabled={quantity <= 1}
                    />
                    <Text mx={4} fontWeight="bold" minW="20px" textAlign="center">
                      {quantity}
                    </Text>
                    <IconButton
                      aria-label="Increase quantity"
                      icon={<FiPlus />}
                      size="sm"
                      isRound
                      variant="outline"
                      onClick={increaseQuantity}
                      isDisabled={quantity >= 10}
                    />
                  </Flex>
                </Flex>
                
                <Button 
                  colorScheme="primary" 
                  size="lg" 
                  width="full"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct?.inStock}
                  leftIcon={<FiShoppingCart />}
                >
                  {selectedProduct?.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </Box>
            ) : (
              <Box width="100%" height="100px" bg="gray.200" borderRadius="md" mt={4} />
            )}
          </Flex>
        </GridItem>
      </Grid>
      
      {/* Related Products section could be added here */}
    </Container>
    
    {/* Floating Cart Sidebar */}
    <CartSidebar isOpen={isOpen} onClose={closeSidebar} />
    </motion.div>
  );
};

export default ProductDetailPage;
