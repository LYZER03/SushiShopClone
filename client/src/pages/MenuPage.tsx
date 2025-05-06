import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/layout';
import { GridItem } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { InputGroup } from '@chakra-ui/input';
import { InputLeftElement } from '@chakra-ui/input';
import { Input } from '@chakra-ui/input';
import { Select } from '@chakra-ui/select';
import { Button } from '@chakra-ui/button';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { Icon } from '@chakra-ui/icon';
import { Drawer } from '@chakra-ui/modal';
import { DrawerBody } from '@chakra-ui/modal';
import { DrawerHeader } from '@chakra-ui/modal';
import { DrawerOverlay } from '@chakra-ui/modal';
import { DrawerContent } from '@chakra-ui/modal';
import { DrawerCloseButton } from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import useProductStore from '../stores/productStore';
import { ProductSortOptions } from '../types/product.types';

/**
 * MenuPage component displays all sushi products with filtering and sorting capabilities
 */
const MenuPage = (): React.ReactElement => {
  // Get products from the store
  const {
    fetchProducts,
    getFilteredProducts,
    filters,
    setFilters,
    clearFilters,
    sortOptions,
    setSortOptions,
    isLoading,
    error,
  } = useProductStore();

  // State for search input
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  
  // Get products
  const products = getFilteredProducts();
  
  // Calculate max price for filter slider
  const maxPrice = Math.max(...useProductStore.getState().products.map(p => p.price), 50);

  // Drawer for filters on mobile
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  const filterWidth = useBreakpointValue({ base: 'full', md: '250px', lg: '280px' });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search
  const handleSearch = () => {
    setFilters({ searchTerm });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [field, order] = value.split('-');
    setSortOptions({
      field: field as ProductSortOptions['field'],
      order: order as ProductSortOptions['order'],
    });
  };

  // Get current sort value
  const getCurrentSortValue = () => {
    return `${sortOptions.field}-${sortOptions.order}`;
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Page Header */}
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          Sushi Menu
        </Heading>
        <Text color="gray.600">
          Browse our selection of fresh and delicious sushi options
        </Text>
      </Box>

      {/* Search and Sort Controls */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'stretch', md: 'center' }}
        mb={6} 
        gap={4}
      >
        <Flex flex="1" maxW={{ base: '100%', md: '400px' }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon viewBox="0 0 24 24" color="gray.400">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </Icon>
            </InputLeftElement>
            <Input
              placeholder="Search sushi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Button
            ml={2}
            colorScheme="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Flex>

        <Flex gap={4} align="center">
          {isMobile && (
            <Button colorScheme="primary" variant="outline" onClick={onOpen}>
              Filters
            </Button>
          )}
          
          <Select
            maxW="200px"
            value={getCurrentSortValue()}
            onChange={handleSortChange}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="rating-desc">Rating (High-Low)</option>
            <option value="createdAt-desc">Newest First</option>
          </Select>
        </Flex>
      </Flex>

      {/* Product Grid with Filters */}
      <Grid
        templateColumns={{ base: '1fr', md: `${filterWidth} 1fr` }}
        gap={8}
      >
        {/* Filters for Desktop */}
        {!isMobile && (
          <GridItem>
            <ProductFilter
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              productCount={products.length}
              maxPrice={maxPrice}
            />
          </GridItem>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
            <DrawerBody>
              <ProductFilter
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  // Don't close drawer on filter change to allow multiple selections
                }}
                onClearFilters={() => {
                  clearFilters();
                  onClose();
                }}
                productCount={products.length}
                maxPrice={maxPrice}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Product Grid */}
        <GridItem>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            columns={{ base: 1, md: 2, lg: 3, xl: 3 }}
            spacing={6}
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default MenuPage;
