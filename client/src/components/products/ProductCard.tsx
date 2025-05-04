import React, { useState } from 'react';
import {
  Box,
  Image,
  Badge,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react';
// We're using programmatic navigation instead of RouterLink
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
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showAddToCart = true 
}) => {
  const { addItem } = useCartStore();
  // We don't need the useDisclosure hook anymore since we're using useState for tooltip
  
  // We'll use a separate state for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

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

  return (
    <Box
      bg="white"
      rounded="lg"
      boxShadow="md"
      overflow="hidden"
      transition="all 0.3s"
      position="relative"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      as="div"
      onClick={(e) => {
        // Only navigate if not clicking on the add to cart button
        if (!(e.target as HTMLElement).closest('button')) {
          // We'll handle navigation programmatically
          window.location.href = `/menu/${product.id}`;
        }
      }}
      cursor="pointer"
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
          >
            {tag}
          </Badge>
        ))}
      </Flex>

      {/* Image */}
      <Box height="180px" overflow="hidden">
        {/* Using a conditional render instead of fallback prop for compatibility */}
        {productImage?.url ? (
          <Image
            src={productImage.url}
            alt={productImage.alt}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <Box bg="gray.200" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
            Sushi
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={2}>
          <Text 
            fontWeight="semibold" 
            fontSize="lg" 
            overflow="hidden" 
            textOverflow="ellipsis" 
            whiteSpace="nowrap"
          >
            {product.name}
          </Text>
          <Text fontWeight="bold" color="primary.500">
            ${product.price.toFixed(2)}
          </Text>
        </Flex>

        {/* Using style prop instead of sx for compatibility */}
        <Text 
          fontSize="sm" 
          color="gray.600" 
          mb={3} 
          height="36px"
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
            <Box mr={1}>
              <svg
                fill="currentColor"
                color="primary.400"
                width="12px"
                height="12px"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </Box>
            <Text fontSize="sm" fontWeight="medium">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </Text>
          </Flex>
        )}

        {/* Add to cart button with tooltip */}
        {showAddToCart && (
          <Box position="relative" width="full">
            <Button
              size="sm"
              colorScheme="primary"
              width="full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {/* Custom tooltip implementation */}
            {showTooltip && (
              <Box
                position="absolute"
                top="-8"
                left="50%"
                transform="translateX(-50%)"
                bg="green.500"
                color="white"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                zIndex="tooltip"
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
