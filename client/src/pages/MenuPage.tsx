import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, Text, Flex, Link, Container } from '@chakra-ui/layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/breadcrumb';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/button';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import ProductGrid from '../components/products/ProductGrid';
import CategoryFilter from '../components/filters/CategoryFilter';
import useProductStore from '../stores/productStore';

/**
 * MenuPage component displays all sushi products with filtering and sorting capabilities
 * Adapté selon le design SustainLanguage avec une structure plus propre
 */
const MenuPage = (): React.ReactElement => {
  // Get products from the store
  const {
    fetchProducts,
    getFilteredProducts,
    filters,
    setFilters,
    isLoading,
    error,
  } = useProductStore();
  
  // Get products
  const products = getFilteredProducts();

  // Drawer for filters on mobile
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fonction pour scroll vers une section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // État pour suivre la catégorie active dans le breadcrumb
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Référence pour observer les sections
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Organiser les produits par catégorie
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);
  
  // Générer un ID de section à partir d'une catégorie
  const generateSectionId = (category: string) => {
    return `section-${category}`;
  };
  
  // Obtenir le nom d'affichage d'une catégorie à partir de son ID
  const getCategoryDisplayName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'sushi': 'Sushi & Rolls à la carte',
      'box': 'Box & Plateaux',
      'appetizer': 'Entrées & Soupes',
      'main': 'Plats chauds',
      'dessert': 'Desserts',
      'drink': 'Boissons'
    };
    return categoryMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };
  
  // Configuration de l'IntersectionObserver pour suivre la section visible
  useEffect(() => {
    if (!sectionsRef.current) return;
    
    // Création de l'observer pour détecter quelle section est visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Extraire l'ID de catégorie de l'ID de la section
            const sectionId = entry.target.id;
            const categoryId = sectionId.replace('section-', '');
            setActiveCategory(categoryId);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-100px 0px -300px 0px' }
    );
    
    // Observer chaque section de catégorie
    const sections = document.querySelectorAll('[id^="section-"]');
    sections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      // Nettoyage de l'observer au démontage
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [productsByCategory]);

  return (
    <Flex flexDirection="column" minH="100vh">
      {/* Breadcrumb */}
      <Box px={4} py={2} borderBottomWidth="1px" borderColor="gray.200">
        <Container maxW="container.xl">
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/" color="gray.500">Home</BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/menu" color="gray.500">Carte</BreadcrumbLink>
            </BreadcrumbItem>
            
            {activeCategory && (
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="primary.500" fontWeight="semibold">
                  {getCategoryDisplayName(activeCategory)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </Container>
      </Box>

      {/* Contrôles de filtrage mobile - visibles uniquement sur mobile */}
      {isMobile && (
        <Box px={4} py={2}>
          <Container maxW="container.xl">
            <Flex justify="flex-end">
              <Button colorScheme="primary" variant="outline" onClick={onOpen}>
                Catégories
              </Button>
            </Flex>
          </Container>
        </Box>
      )}

      {/* Main content area */}
      <Box flex="1">
        <Container maxW="container.xl" py={6}>
          <Flex gap={8}>
            {/* Left sidebar - desktop only */}
            <Box
              display={{ base: "none", md: "block" }}
              width="250px"
              position="sticky"
              top="20px"
              alignSelf="flex-start"
              pr={6}
            >
              <CategoryFilter
                filters={filters}
                onFilterChange={setFilters}
                onScrollToSection={scrollToSection}
              />
            </Box>

            {/* Main content with products */}
            <Box flex="1">
              {isLoading ? (
                <Flex justify="center" align="center" minH="300px">
                  <Text>Chargement des produits...</Text>
                </Flex>
              ) : error ? (
                <Flex justify="center" align="center" minH="300px">
                  <Text color="red.500">Erreur: {error}</Text>
                </Flex>
              ) : (
                <Box ref={sectionsRef}>
                  {Object.keys(productsByCategory).map((category) => (
                    <Box 
                      key={category} 
                      id={generateSectionId(category)}
                      mb={12}
                      pt={4}
                      scrollMarginTop="100px"
                    >
                      <Heading as="h2" size="lg" mb={6}>{getCategoryDisplayName(category)}</Heading>
                      <ProductGrid 
                        products={productsByCategory[category]} 
                        isLoading={false} 
                        error={null}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Filters drawer for mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Catégories</DrawerHeader>
          <DrawerBody>
            <CategoryFilter
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                onClose();
              }}
              onScrollToSection={(sectionId) => {
                // Fermer le drawer puis faire défiler vers la section
                onClose();
                setTimeout(() => scrollToSection(sectionId), 300); // Attendre la fermeture du drawer
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MenuPage;
