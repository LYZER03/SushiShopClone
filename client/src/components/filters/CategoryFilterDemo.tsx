import React, { useState } from 'react';
import { Box, Heading, Container, Text, useToast } from '@chakra-ui/react';
import CategoryFilters, { Category } from './CategoryFilters';

// Données d'exemple pour les catégories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Nouveautés',
    slug: 'nouveautes',
    subCategories: [
      { id: '101', name: 'Plats spéciaux', slug: 'plats-speciaux' },
      { id: '102', name: 'Promotions', slug: 'promotions' }
    ]
  },
  {
    id: '2',
    name: 'Menu',
    slug: 'menu',
    subCategories: [
      { id: '201', name: 'Menu midi', slug: 'menu-midi' },
      { id: '202', name: 'Menu duo', slug: 'menu-duo' },
      { id: '203', name: 'Menu dégustation', slug: 'menu-degustation' }
    ]
  },
  {
    id: '3',
    name: 'Sushi & Rolls',
    slug: 'sushi-rolls',
    subCategories: [
      { id: '301', name: 'Nigiri', slug: 'nigiri' },
      { id: '302', name: 'Maki', slug: 'maki' },
      { id: '303', name: 'Uramaki', slug: 'uramaki' },
      { id: '304', name: 'California rolls', slug: 'california' },
      { id: '305', name: 'Dragon rolls', slug: 'dragon' }
    ]
  },
  {
    id: '4',
    name: 'Bowls',
    slug: 'bowls',
    subCategories: [
      { id: '401', name: 'Poke bowls', slug: 'poke' },
      { id: '402', name: 'Chirashi', slug: 'chirashi' },
      { id: '403', name: 'Donburi', slug: 'donburi' }
    ]
  },
  {
    id: '5',
    name: 'Plats chauds',
    slug: 'plats-chauds',
    subCategories: [
      { id: '501', name: 'Yakisoba', slug: 'yakisoba' },
      { id: '502', name: 'Ramen', slug: 'ramen' },
      { id: '503', name: 'Tempura', slug: 'tempura' },
      { id: '504', name: 'Gyoza', slug: 'gyoza' }
    ]
  },
  {
    id: '6',
    name: 'Sashimi',
    slug: 'sashimi',
    subCategories: [
      { id: '601', name: 'Saumon', slug: 'sashimi-saumon' },
      { id: '602', name: 'Thon', slug: 'sashimi-thon' },
      { id: '603', name: 'Mixte', slug: 'sashimi-mixte' }
    ]
  },
  {
    id: '7',
    name: 'Accompagnements',
    slug: 'accompagnements',
    subCategories: [
      { id: '701', name: 'Salades', slug: 'salades' },
      { id: '702', name: 'Soupes', slug: 'soupes' },
      { id: '703', name: 'Riz', slug: 'riz' }
    ]
  },
  {
    id: '8',
    name: 'Desserts',
    slug: 'desserts',
    subCategories: [
      { id: '801', name: 'Mochi', slug: 'mochi' },
      { id: '802', name: 'Dorayaki', slug: 'dorayaki' },
      { id: '803', name: 'Crème brûlée au thé matcha', slug: 'creme-brulee-matcha' }
    ]
  },
  {
    id: '9',
    name: 'Boissons',
    slug: 'boissons',
    subCategories: [
      { id: '901', name: 'Thé japonais', slug: 'the-japonais' },
      { id: '902', name: 'Saké', slug: 'sake' },
      { id: '903', name: 'Sodas', slug: 'sodas' },
      { id: '904', name: 'Bières japonaises', slug: 'bieres-japonaises' }
    ]
  }
];

const CategoryFilterDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>();
  const toast = useToast();

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    toast({
      title: 'Catégorie sélectionnée',
      description: `Catégorie: ${categorySlug}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSubCategorySelect = (categorySlug: string, subCategorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedSubCategory(subCategorySlug);
    toast({
      title: 'Sous-catégorie sélectionnée',
      description: `Catégorie: ${categorySlug}, Sous-catégorie: ${subCategorySlug}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={8} size="xl" textAlign="center">
        Filtres par catégorie
      </Heading>
      
      <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={8} alignItems="flex-start">
        <Box width={{ base: '100%', md: '300px' }}>
          <Heading as="h2" size="md" mb={4}>
            Catégories
          </Heading>
          <CategoryFilters 
            categories={mockCategories}
            onCategorySelect={handleCategorySelect}
            onSubCategorySelect={handleSubCategorySelect}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
          />
        </Box>
        
        <Box flex="1">
          <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading as="h2" size="md" mb={4}>
              Sélection actuelle
            </Heading>
            <Text mb={2}>
              <strong>Catégorie :</strong> {selectedCategory || 'Aucune'}
            </Text>
            <Text>
              <strong>Sous-catégorie :</strong> {selectedSubCategory || 'Aucune'}
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CategoryFilterDemo;
