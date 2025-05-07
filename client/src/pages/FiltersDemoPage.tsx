import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import CategoryFilterDemo from '../components/filters/CategoryFilterDemo';

/**
 * Page de démonstration pour le composant d'accordéon de filtres
 */
const FiltersDemoPage: React.FC = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8} textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          Démonstration des filtres en accordéon
        </Heading>
        <Heading as="h2" size="md" fontWeight="normal" color="gray.600">
          Exemple d'implémentation pour la navigation par catégories
        </Heading>
      </Box>
      
      <CategoryFilterDemo />
    </Container>
  );
};

export default FiltersDemoPage;
