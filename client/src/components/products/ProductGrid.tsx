import React from 'react';
import { SimpleGrid } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Image } from '@chakra-ui/image';
import { Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { motion } from 'framer-motion';
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
 * Includes staggered animations for a polished UX
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = 6,
}) => {
  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  // Loading state with shimmer effect
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="300px" w="100%" flexDirection="column">
        <Spinner size="xl" color="primary.500" thickness="4px" speed="0.65s" mb={4} />
        <Text color="gray.500" fontSize="lg" fontWeight="medium">
          Loading delicious sushi...
        </Text>
      </Flex>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="300px"
        w="100%"
        bg="red.50"
        borderRadius="lg"
        p={6}
        boxShadow="sm"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Image 
            src="/images/error.svg"
            alt="Error" 
            boxSize="100px" 
            mb={4}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/100?text=Error";
            }}
          />
        </motion.div>
        <Heading as="h3" size="md" color="red.500" textAlign="center" mb={2}>
          Oops! Something went wrong
        </Heading>
        <Text color="gray.600" fontSize="md" textAlign="center" mb={4}>
          {error}
        </Text>
        <Button 
          colorScheme="primary" 
          onClick={() => window.location.reload()}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </Button>
      </Flex>
    );
  }

  // Empty state with improved visuals
  if (products.length === 0) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="300px"
        w="100%"
        bg="gray.50"
        borderRadius="lg"
        p={6}
        boxShadow="sm"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Image 
            src="/images/empty-state.svg"
            alt="No products found" 
            boxSize="120px" 
            mb={4}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120?text=Empty";
            }}
          />
        </motion.div>
        <Heading as="h3" size="md" color="gray.600" textAlign="center" mb={2}>
          No products found
        </Heading>
        <Text color="gray.500" fontSize="md" textAlign="center" mt={2} mb={4}>
          Try adjusting your filters or search terms
        </Text>
        <Button 
          variant="outline" 
          colorScheme="primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Flex>
    );
  }

  // Grid of products with staggered animation
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      <SimpleGrid columns={columns} gap={spacing} width="100%">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            variants={itemVariants}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </SimpleGrid>
      
      {/* Product count */}
      <Text 
        textAlign="center" 
        color="gray.500" 
        mt={6} 
        fontSize="sm"
      >
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </Text>
    </motion.div>
  );
};

export default ProductGrid;
