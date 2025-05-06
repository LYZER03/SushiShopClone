import React, { useState } from 'react';
import { Button } from '@chakra-ui/button';
import { IconButton } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { useNumberInput } from '@chakra-ui/number-input';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

import useCartStore from '../../stores/cartStore';
import { Product } from '../../types/cart.types';

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  compact?: boolean;
}

/**
 * Reusable Add to Cart button component
 * Can be displayed in compact mode or with quantity selector
 * Includes animation and feedback when adding to cart
 */
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  size = 'md',
  showQuantity = false,
  compact = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  
  // Setup number input hook for quantity selector
  const {
    value,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 99,
    precision: 0,
  });
  
  const quantity = parseInt(value);
  
  // Handlers for quantity buttons
  const incProps = getIncrementButtonProps();
  const decProps = getDecrementButtonProps();
  
  // Handle add to cart with animation
  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity);
    
    // Reset animation state after delay
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  
  // Compact mode - icon only button
  if (compact) {
    return (
      <Tooltip label="Ajouter au panier" placement="top" hasArrow>
        <Box as={motion.div} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            icon={<FiShoppingCart />}
            aria-label="Ajouter au panier"
            colorScheme="primary"
            isLoading={isAdding}
            onClick={handleAddToCart}
            size={size}
            variant="ghost"
            borderRadius="full"
            _hover={{ bg: 'primary.50' }}
          />
        </Box>
      </Tooltip>
    );
  }
  
  // Full button with optional quantity selector
  return (
    <Box>
      {showQuantity && (
        <HStack maxW="120px" mb={2}>
          <IconButton
            {...decProps}
            icon={<FiMinus />}
            aria-label="Réduire la quantité"
            size="xs"
            variant="outline"
          />
          <Box
            px={2}
            textAlign="center"
            fontWeight="semibold"
            fontSize="sm"
            minW="40px"
          >
            {value}
          </Box>
          <IconButton
            {...incProps}
            icon={<FiPlus />}
            aria-label="Augmenter la quantité"
            size="xs"
            variant="outline"
          />
        </HStack>
      )}
      
      <Button
        leftIcon={<FiShoppingCart />}
        colorScheme="primary"
        size={size}
        isLoading={isAdding}
        loadingText="Ajout..."
        onClick={handleAddToCart}
        width={showQuantity ? "full" : "auto"}
        as={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showQuantity ? `Ajouter • ${(product.price * quantity).toFixed(2)} €` : 'Ajouter au panier'}
      </Button>
    </Box>
  );
};

export default AddToCartButton;
