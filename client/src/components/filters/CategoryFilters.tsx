import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorMode
} from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/accordion';

// Interface pour représenter une sous-catégorie
export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

// Interface pour représenter une catégorie principale
export interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

interface CategoryFiltersProps {
  categories: Category[];
  onSubCategorySelect?: (categorySlug: string, subCategorySlug: string) => void;
  selectedCategory?: string;
  selectedSubCategory?: string;
  // Index des items ouverts dans l'accordéon
  expandedIndexes?: number[];
  // Fonction pour mettre à jour les index ouverts
  setExpandedIndexes?: (indexes: number[]) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  onSubCategorySelect,
  selectedSubCategory,
  expandedIndexes = [],
  setExpandedIndexes
}) => {
  // Utiliser useColorMode au lieu de useColorModeValue
  const { colorMode } = useColorMode();
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  const hoverBg = colorMode === 'light' ? 'gray.50' : 'gray.700';
  const activeBg = colorMode === 'light' ? 'gray.100' : 'gray.600';
  
  // Gérer le clic sur une catégorie (ouvre/ferme l'accordéon)
  const handleCategoryClick = (index: number) => {
    if (setExpandedIndexes) {
      // Si l'index est déjà ouvert, le fermer, sinon l'ouvrir
      if (expandedIndexes.includes(index)) {
        setExpandedIndexes(expandedIndexes.filter(i => i !== index));
      } else {
        setExpandedIndexes([...expandedIndexes, index]);
      }
    }
  };
  
  // Gérer le clic sur une sous-catégorie
  const handleSubCategoryClick = (categorySlug: string, subCategorySlug: string) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(categorySlug, subCategorySlug);
    }
  };

  return (
    <Accordion 
      allowMultiple 
      width="100%" 
      border="none"
      index={expandedIndexes}
    >
      {categories.map((category, index) => (
        <AccordionItem 
          key={category.id} 
          border="none" 
          borderBottom={`1px solid`} 
          borderColor={borderColor}
        >
          <AccordionButton 
            p={3}
            _hover={{ bg: hoverBg }}
            onClick={() => handleCategoryClick(index)}
          >
            <Box flex="1" textAlign="left">
              <Text fontWeight="bold" fontSize="md">
                {category.name}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          
          <AccordionPanel pb={4} pt={2} pl={4}>
            <VStack align="flex-start" spacing={2} width="100%">
              {category.subCategories.map((subCategory) => (
                <Box
                  key={subCategory.id}
                  py={1}
                  px={2}
                  borderRadius="md"
                  width="100%"
                  cursor="pointer"
                  bg={selectedSubCategory === subCategory.slug ? activeBg : 'transparent'}
                  _hover={{ bg: hoverBg }}
                  onClick={() => handleSubCategoryClick(category.slug, subCategory.slug)}
                >
                  <Text fontSize="sm">
                    {subCategory.name}
                  </Text>
                </Box>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CategoryFilters;
