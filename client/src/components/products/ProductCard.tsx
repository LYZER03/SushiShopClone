import React, { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Badge } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Skeleton } from '@chakra-ui/skeleton';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, ProductTag } from '../../types/product.types';
import useCartStore from '../../stores/cartStore';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

// Define interface for cart item to properly type our addItem call
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * ProductCard displays an individual product with image, name, price, and optional add to cart button
 * Used in the product grid on the menu page and potentially in other product listings
 * Includes hover animations and visual feedback when adding to cart
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showAddToCart = true 
}) => {
  const { addItem } = useCartStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  // Get default image or first image
  const productImage = product.images.find((img) => img.isDefault) || product.images[0];
  
  // Function to handle adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    
    // Create cart item from product
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: productImage?.url,
    };
    
    // Use proper typing without any
    addItem(cartItem);
    
    // Show tooltip feedback
    setShowTooltip(true);
    
    // Auto close tooltip after 2 seconds
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
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

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    tap: { scale: 0.98 }
  };
  
  return (
    <Box
      as={motion.div}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      bg={cardBg}
      rounded="lg"
      boxShadow="md"
      overflow="hidden"
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Tags and badges */}
      <Flex position="absolute" top={2} left={2} zIndex={10} gap={1} flexWrap="wrap">
        {product.tags.map((tag) => (
          <Badge
            key={tag}
            colorScheme={getTagColor(tag)}
            variant="solid"
            fontSize="xs"
            textTransform="capitalize"
            mb={1}
            mr={1}
            borderRadius="full"
            px={2}
            py={1}
          >
            {tag}
          </Badge>
        ))}
      </Flex>

      {/* Image with Skeleton Loading */}
      <Box height="200px" overflow="hidden" position="relative">
        <Skeleton isLoaded={imageLoaded} height="100%" fadeDuration={1} startColor="gray.100" endColor="gray.300">
          {productImage?.url ? (
            <Image
              src={productImage.url}
              alt={productImage.alt}
              objectFit="cover"
              w="100%"
              h="100%"
              transition="transform 0.3s ease"
              _groupHover={{ transform: 'scale(1.05)' }}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <Flex 
              bg="gray.200" 
              w="100%" 
              h="100%" 
              alignItems="center" 
              justifyContent="center"
              color="gray.600"
              fontWeight="medium"
              fontSize="lg"
            >
              Sushi
            </Flex>
          )}
        </Skeleton>
      </Box>

      {/* Content */}
      <Box p={4} flex="1" display="flex" flexDirection="column">
        <RouterLink to={`/menu/${product.id}`} style={{ textDecoration: 'none' }}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text 
              fontWeight="semibold" 
              fontSize="lg" 
              overflow="hidden" 
              textOverflow="ellipsis" 
              whiteSpace="nowrap"
              color={textColor}
            >
              {product.name}
            </Text>
            <Text fontWeight="bold" color="primary.500">
              ${product.price.toFixed(2)}
            </Text>
          </Flex>

          {/* Description with clamp */}
          <Text 
            fontSize="sm" 
            color={secondaryTextColor} 
            mb={3} 
            height="40px"
            overflow="hidden"
            textOverflow="ellipsis"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
            } as React.CSSProperties}
          >
            {product.description}
          </Text>

          {/* Rating */}
          {product.rating && (
            <Flex align="center" mb={3}>
              <Box mr={1} color="yellow.400">
                <svg
                  fill="currentColor"
                  width="14px"
                  height="14px"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </Box>
              <Text fontSize="sm" fontWeight="medium" color={secondaryTextColor}>
                {product.rating.toFixed(1)} 
                <Text as="span" color={secondaryTextColor} ml={1} fontWeight="normal">
                  ({product.reviewCount} reviews)
                </Text>
              </Text>
            </Flex>
          )}
        </RouterLink>
        
        {/* Spacer to push button to bottom */}
        <Box flex="1" />

        {/* Add to cart button with tooltip */}
        {showAddToCart && (
          <Box position="relative" width="full">
            <Button
              as={motion.button}
              size="sm"
              colorScheme="primary"
              width="full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              borderRadius="md"
              fontWeight="medium"
              mt={2}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {/* Animated tooltip */}
            {showTooltip && (
              <Box
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                position="absolute"
                top="-8"
                left="50%"
                transform="translateX(-50%)"
                bg="green.500"
                color="white"
                px="3"
                py="1"
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                zIndex="tooltip"
                boxShadow="md"
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderWidth: '4px',
                  borderStyle: 'solid',
                  borderColor: 'green.500 transparent transparent transparent'
                }}
              >
                Added to cart!
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductCard;
