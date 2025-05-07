import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Text,
  useToast 
} from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/skeleton';
import CategoryFilters, { Category } from './CategoryFilters';
import { fetchCategories } from '../../services/categoryService';
import { ProductFilterOptions } from '../../types/product.types';

interface CategoryFilterProps {
  filters: ProductFilterOptions;
  onScrollToSection?: (sectionId: string) => void;
  // onFilterChange n'est plus utilisé mais gardé pour compatibilité avec MenuPage
  onFilterChange?: (newFilters: Partial<ProductFilterOptions>) => void;
  // Classe CSS pour le positionnement sticky
  className?: string;
}

/**
 * Composant d'accordéon de filtres de catégories intégré au système de filtres existant
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filters,
  onScrollToSection,
  className
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // État pour suivre les sélections
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.category as string | undefined
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(
    undefined
  );
  
  // État pour gérer les sections ouvertes de l'accordéon
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  // Charger les catégories au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories. Veuillez réessayer.');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les catégories',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Mettre à jour les filtres quand les sélections changent
  useEffect(() => {
    if (selectedCategory !== filters.category) {
      setSelectedCategory(filters.category);
    }
  }, [filters.category]);

  // Créer un ID de section formaté à partir d'un slug
  const formatSectionId = (slug: string): string => {
    return `section-${slug}`;
  };

  // Gestionnaire pour la sélection d'une sous-catégorie
  const handleSubCategorySelect = useCallback((categorySlug: string, subCategorySlug: string) => {
    // Mettre à jour l'état visuel mais sans filtrer
    setSelectedCategory(categorySlug);
    setSelectedSubCategory(subCategorySlug);
    
    // Créer un ID formaté pour le scroll
    const sectionId = formatSectionId(categorySlug);
    
    // Déclencher uniquement le scroll vers la section correspondante
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  }, [onScrollToSection]);

  if (loading) {
    return (
      <Box className={className}>
        <Skeleton height="30px" mb={4} />
        <Skeleton height="100px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={className} bg="red.50">
        <Text color="red.500">Erreur: {error}</Text>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <CategoryFilters
        categories={categories}
        onSubCategorySelect={handleSubCategorySelect}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        expandedIndexes={expandedIndexes}
        setExpandedIndexes={setExpandedIndexes}
      />
    </Box>
  );
};

export default CategoryFilter;
