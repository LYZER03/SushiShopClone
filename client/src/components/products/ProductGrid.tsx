import React from 'react';
import { SimpleGrid, Flex, Text, Spinner, Image } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import { Product } from '../../types/product.types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  columns?: { base: number; md: number; lg: number; xl: number };
  spacing?: number;
}

/**
 * ProductGrid displays a responsive grid of product cards
 * Handles loading, error, and empty states appropriately
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = 6,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="300px" w="100%">
        <Spinner size="xl" color="primary.500" />
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="300px"
        w="100%"
        bg="red.50"
        borderRadius="md"
        p={6}
      >
        <Image 
          src="/images/error.svg"
          alt="Error" 
          boxSize="100px" 
          mb={4}
          onError={(e) => {
            // Use an inline error handler instead of fallbackSrc
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/100?text=Error";
          }}
        />
        <Text color="red.500" fontSize="lg" fontWeight="medium" textAlign="center">
          {error}
        </Text>
        <Text color="gray.600" fontSize="md" textAlign="center" mt={2}>
          Please try again later or contact support if the problem persists.
        </Text>
      </Flex>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="300px"
        w="100%"
        bg="gray.50"
        borderRadius="md"
        p={6}
      >
        <Image 
          src="/images/empty-state.svg"
          alt="No products found" 
          boxSize="100px" 
          mb={4}
          onError={(e) => {
            // Use an inline error handler instead of fallbackSrc
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/100?text=Empty";
          }}
        />
        <Text color="gray.500" fontSize="lg" fontWeight="medium" textAlign="center">
          No products found
        </Text>
        <Text color="gray.500" fontSize="md" textAlign="center" mt={2}>
          Try adjusting your filters or search terms
        </Text>
      </Flex>
    );
  }

  // Grid of products
  return (
    <SimpleGrid columns={columns} gap={spacing} width="100%">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
};

export default ProductGrid;
