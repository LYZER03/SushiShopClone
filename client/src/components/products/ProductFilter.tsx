import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Flex,
  Divider,
  useColorModeValue,
  Button,
  Badge,
} from '@chakra-ui/react';
import { ProductCategory, ProductFilterOptions, ProductTag } from '../../types/product.types';

interface ProductFilterProps {
  filters: ProductFilterOptions;
  onFilterChange: (newFilters: Partial<ProductFilterOptions>) => void;
  onClearFilters: () => void;
  productCount: number;
  maxPrice: number;
}

/**
 * ProductFilter component with category, price range, and tag filters
 */
const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  productCount,
  maxPrice = 50,
}) => {
  const minPrice = 0;
  const sliderBgColor = useColorModeValue('gray.100', 'gray.700');
  // Removed unused activeBgColor variable
  
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
  const handleCategoryChange = (category: ProductCategory | null) => {
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
      p={5}
      bg="white"
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor="gray.200"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Filters</Heading>
        {hasActiveFilters() && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </Flex>
      
      <Text color="gray.500" mb={4}>
        {productCount} products found
      </Text>
      
      <Stack spacing={6}>
        {/* Category Filter */}
        <Box>
          <Heading size="sm" mb={3}>
            Categories
          </Heading>
          <Stack spacing={2}>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={filters.category === category ? 'solid' : 'outline'}
                colorScheme={filters.category === category ? 'primary' : 'gray'}
                onClick={() => handleCategoryChange(category)}
                justifyContent="flex-start"
                textTransform="capitalize"
              >
                {category}
              </Button>
            ))}
          </Stack>
        </Box>
        
        <Divider />
        
        {/* Price Range Filter */}
        <Box>
          <Heading size="sm" mb={3}>
            Price Range
          </Heading>
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
            <Text fontSize="sm">${filters.priceRange?.min || minPrice}</Text>
            <Text fontSize="sm">${filters.priceRange?.max || maxPrice}</Text>
          </Flex>
        </Box>
        
        <Divider />
        
        {/* Tags Filter */}
        <Box>
          <Heading size="sm" mb={3}>
            Tags
          </Heading>
          <CheckboxGroup
            value={filters.tags || []}
            onChange={(values) => handleTagChange(values as ProductTag[])}
          >
            <Stack spacing={2}>
              {tags.map((tag) => (
                <Checkbox key={tag} value={tag}>
                  <Text textTransform="capitalize">{tag}</Text>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      </Stack>
      
      {/* Active Filters */}
      {hasActiveFilters() && (
        <Box mt={6}>
          <Heading size="sm" mb={2}>
            Active Filters
          </Heading>
          <Flex flexWrap="wrap" gap={2}>
            {filters.category && (
              <Badge
                colorScheme="primary"
                variant="solid"
                px={2}
                py={1}
                borderRadius="full"
                textTransform="capitalize"
              >
                {filters.category}
              </Badge>
            )}
            
            {filters.priceRange && (
              <Badge
                colorScheme="green"
                variant="solid"
                px={2}
                py={1}
                borderRadius="full"
              >
                ${filters.priceRange.min} - ${filters.priceRange.max}
              </Badge>
            )}
            
            {filters.tags &&
              filters.tags.map((tag) => (
                <Badge
                  key={tag}
                  colorScheme="blue"
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
        </Box>
      )}
    </Box>
  );
};

export default ProductFilter;
