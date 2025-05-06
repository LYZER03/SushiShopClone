import React, { useState } from 'react';
import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Badge } from '@chakra-ui/layout';
import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb
} from '@chakra-ui/slider';
import { Icon } from '@chakra-ui/icon';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiTag, FiDollarSign, FiX, FiChevronDown, FiChevronUp, FiGrid } from 'react-icons/fi';
import { GiSushis } from 'react-icons/gi';
import { ProductCategory, ProductFilterOptions, ProductTag } from '../../types/product.types';

interface ProductFilterProps {
  filters: ProductFilterOptions;
  onFilterChange: (newFilters: Partial<ProductFilterOptions>) => void;
  onClearFilters: () => void;
  productCount: number;
  maxPrice: number;
  isMobile?: boolean;
}

/**
 * ProductFilter component with category, price range, and tag filters
 * Enhanced with animations and improved mobile experience
 */
const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  productCount,
  maxPrice = 50,
  isMobile = false
}) => {
  const minPrice = 0;
  const { colorMode } = useColorMode();
  const sliderBgColor = colorMode === 'light' ? 'gray.100' : 'gray.700';
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  
  // Set default states based on mobile view
  const [categoryOpen, setCategoryOpen] = useState(!isMobile);
  const [priceOpen, setPriceOpen] = useState(!isMobile);
  const [tagsOpen, setTagsOpen] = useState(!isMobile);
  
  // Animation variants
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };
  
  // Get category icon - using a simple icon for all categories for now
  const getCategoryIcon = () => {
    return GiSushis;
  };
  
  // Categories for filtering
  const categories: ProductCategory[] = [
    'sushi',
    'sashimi',
    'rolls',
    'bowls',
    'sides',
    'drinks',
  ];
  
  // Tags for filtering
  const tags: ProductTag[] = [
    'popular',
    'new',
    'spicy',
    'vegetarian',
    'gluten-free',
  ];
  
  // Handle category change
  const handleCategoryChange = (category: ProductCategory) => {
    if (category === filters.category) {
      // If clicking the active category, clear it
      onFilterChange({ category: undefined });
    } else {
      onFilterChange({ category });
    }
  };
  
  // Handle tag selection
  const handleTagChange = (selectedTags: ProductTag[]) => {
    onFilterChange({ tags: selectedTags.length > 0 ? selectedTags : undefined });
  };
  
  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    const [min, max] = values;
    onFilterChange({
      priceRange: {
        min,
        max,
      },
    });
  };
  
  // Determine if a filter is active
  const hasActiveFilters = () => {
    return (
      filters.category !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      filters.priceRange !== undefined
    );
  };

  return (
    <Box
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      p={5}
      bg={bgColor}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center">
          <Icon as={FiFilter} mr={2} color="primary.500" />
          <Heading size="md">Filters</Heading>
        </Flex>
        {hasActiveFilters() && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={onClearFilters}
            leftIcon={<FiX />}
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear All
          </Button>
        )}
      </Flex>
      
      <Flex align="center" mb={4}>
        <Badge colorScheme="primary" mr={2} px={2} py={1} borderRadius="md">
          {productCount}
        </Badge>
        <Text color="gray.500">
          products found
        </Text>
      </Flex>
      
      <Stack spacing={6}>
        {/* Category Filter */}
        <Box>
          <Flex 
            justify="space-between" 
            align="center" 
            mb={3} 
            cursor="pointer"
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <Flex align="center">
              <Icon as={FiGrid} mr={2} color="primary.500" />
              <Heading size="sm">Categories</Heading>
            </Flex>
            <Icon as={categoryOpen ? FiChevronUp : FiChevronDown} />
          </Flex>
          
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <Stack spacing={2} mt={2}>
                  {categories.map((category) => {
                    const CategoryIcon = getCategoryIcon();
                    return (
                      <Button
                        key={category}
                        size="sm"
                        variant={filters.category === category ? 'solid' : 'outline'}
                        colorScheme={filters.category === category ? 'primary' : 'gray'}
                        onClick={() => handleCategoryChange(category)}
                        justifyContent="flex-start"
                        textTransform="capitalize"
                        leftIcon={<Icon as={CategoryIcon} />}
                        as={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {category}
                      </Button>
                    );
                  })}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        
        <Divider />
        
        {/* Price Range Filter */}
        <Box>
          <Flex 
            justify="space-between" 
            align="center" 
            mb={3} 
            cursor="pointer"
            onClick={() => setPriceOpen(!priceOpen)}
          >
            <Flex align="center">
              <Icon as={FiDollarSign} mr={2} color="green.500" />
              <Heading size="sm">Price Range</Heading>
            </Flex>
            <Icon as={priceOpen ? FiChevronUp : FiChevronDown} />
          </Flex>
          
          <AnimatePresence>
            {priceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <Box mt={2}>
                  <RangeSlider
                    defaultValue={[
                      filters.priceRange?.min || minPrice,
                      filters.priceRange?.max || maxPrice,
                    ]}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    onChange={handlePriceChange}
                    mb={2}
                  >
                    <RangeSliderTrack bg={sliderBgColor}>
                      <RangeSliderFilledTrack bg="primary.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6} />
                    <RangeSliderThumb index={1} boxSize={6} />
                  </RangeSlider>
                  <Flex justify="space-between">
                    <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                      ${filters.priceRange?.min || minPrice}
                    </Badge>
                    <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                      ${filters.priceRange?.max || maxPrice}
                    </Badge>
                  </Flex>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        
        <Divider />
        
        {/* Tags Filter */}
        <Box>
          <Flex 
            justify="space-between" 
            align="center" 
            mb={3} 
            cursor="pointer"
            onClick={() => setTagsOpen(!tagsOpen)}
          >
            <Flex align="center">
              <Icon as={FiTag} mr={2} color="blue.500" />
              <Heading size="sm">Tags</Heading>
            </Flex>
            <Icon as={tagsOpen ? FiChevronUp : FiChevronDown} />
          </Flex>
          
          <AnimatePresence>
            {tagsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <Box mt={2}>
                  <CheckboxGroup
                    value={filters.tags || []}
                    onChange={(values) => handleTagChange(values as ProductTag[])}
                  >
                    <Stack spacing={2}>
                      {tags.map((tag) => (
                        <Checkbox 
                          key={tag} 
                          value={tag}
                          colorScheme="blue"
                        >
                          <Text textTransform="capitalize">{tag}</Text>
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Stack>
      
      {/* Active Filters */}
      <AnimatePresence>
        {hasActiveFilters() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box mt={6}>
              <Flex align="center" mb={2}>
                <Heading size="sm">Active Filters</Heading>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={onClearFilters}
                  ml={2}
                  leftIcon={<FiX />}
                >
                  Clear
                </Button>
              </Flex>
              <Flex flexWrap="wrap" gap={2}>
                {filters.category && (
                  <Badge
                    as={motion.div}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    colorScheme="primary"
                    variant="solid"
                    px={2}
                    py={1}
                    borderRadius="full"
                    textTransform="capitalize"
                    cursor="pointer"
                    onClick={() => handleCategoryChange(filters.category!)}
                  >
                    <Flex align="center">
                      {filters.category}
                      <Icon as={FiX} ml={1} boxSize={3} />
                    </Flex>
                  </Badge>
                )}
                
                {filters.priceRange && (
                  <Badge
                    as={motion.div}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    colorScheme="green"
                    variant="solid"
                    px={2}
                    py={1}
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => onFilterChange({ priceRange: undefined })}
                  >
                    <Flex align="center">
                      ${filters.priceRange.min} - ${filters.priceRange.max}
                      <Icon as={FiX} ml={1} boxSize={3} />
                    </Flex>
                  </Badge>
                )}
                
                {filters.tags &&
                  filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      as={motion.div}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      colorScheme="blue"
                      variant="solid"
                      px={2}
                      py={1}
                      borderRadius="full"
                      textTransform="capitalize"
                      cursor="pointer"
                      onClick={() => {
                        const newTags = filters.tags?.filter(t => t !== tag) || [];
                        handleTagChange(newTags.length > 0 ? newTags : []);
                      }}
                    >
                      <Flex align="center">
                        {tag}
                        <Icon as={FiX} ml={1} boxSize={3} />
                      </Flex>
                    </Badge>
                  ))}
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ProductFilter;
