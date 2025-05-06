import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { HStack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

export interface CategoryItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * Tab-based category navigation component
 * Vertical on desktop and horizontal (with scroll) on mobile
 */
const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory,
  onCategoryChange
}) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const activeBgColor = colorMode === 'light' ? 'gray.100' : 'gray.700';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  
  const [visibleCategory, setVisibleCategory] = useState(activeCategory);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  
  // Scroll the active tab into view
  useEffect(() => {
    if (isMobile && tabsRef.current) {
      const activeElement = tabsRef.current.querySelector(`[data-id="${activeCategory}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCategory, isMobile]);
  
  // Handle scroll events to determine which category is visible
  useEffect(() => {
    const handleScroll = () => {
      categories.forEach(cat => {
        const element = document.getElementById(cat.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setVisibleCategory(cat.id);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);
  
  // Handle tab click - scroll to the section
  const handleTabClick = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onCategoryChange(categoryId);
    }
  };
  
  // Toggle mobile categories visibility
  const toggleCategories = () => {
    setShowAll(!showAll);
  };
  
  // Mobile horizontal scrolling tabs
  if (isMobile) {
    return (
      <Box position="sticky" top="0" zIndex="10" pb={2} bg={bgColor}>
        <Flex 
          direction="column" 
          w="100%" 
          borderBottom="1px" 
          borderColor={borderColor}
          pb={1}
        >
          <Flex justify="space-between" align="center" px={4} py={2}>
            <Text fontWeight="bold">Categories</Text>
            <IconButton
              aria-label={showAll ? "Hide categories" : "Show all categories"}
              icon={showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
              size="sm"
              onClick={toggleCategories}
              variant="ghost"
            />
          </Flex>
          
          {showAll && (
            <VStack 
              align="stretch" 
              spacing={1} 
              px={2} 
              pb={2}
              as={motion.div}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: "0.2s" }}
            >
              {categories.map((category) => (
                <Box
                  key={category.id}
                  data-id={category.id}
                  bg={category.id === activeCategory ? activeBgColor : 'transparent'}
                  borderRadius="md"
                  p={2}
                  cursor="pointer"
                  onClick={() => handleTabClick(category.id)}
                  as={motion.div}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Flex align="center">
                    {category.icon && <Box mr={2}>{category.icon}</Box>}
                    <Text fontSize="sm">{category.label}</Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
          
          <HStack 
            spacing={2} 
            overflowX="auto" 
            py={2} 
            px={4} 
            css={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            ref={tabsRef}
            display={showAll ? "none" : "flex"}
          >
            {categories.map((category) => (
              <Box
                key={category.id}
                data-id={category.id}
                bg={category.id === activeCategory ? activeBgColor : 'transparent'}
                color={category.id === activeCategory ? 'primary.500' : 'inherit'}
                borderRadius="full"
                px={3}
                py={1}
                cursor="pointer"
                whiteSpace="nowrap"
                onClick={() => handleTabClick(category.id)}
                fontWeight={category.id === activeCategory ? "semibold" : "normal"}
                fontSize="sm"
              >
                {category.label}
              </Box>
            ))}
          </HStack>
        </Flex>
      </Box>
    );
  }
  
  // Desktop vertical tabs
  return (
    <Box 
      position="sticky" 
      top="80px" 
      maxH="calc(100vh - 120px)"
      overflowY="auto"
      w="100%"
      css={{
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'gray.300', borderRadius: '4px' },
      }}
    >
      <VStack 
        align="stretch" 
        spacing={1}
        p={2}
        borderRadius="md"
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Text fontWeight="bold" mb={2} px={2}>Categories</Text>
        
        {categories.map((category) => (
          <Box
            key={category.id}
            data-id={category.id}
            bg={category.id === visibleCategory ? activeBgColor : 'transparent'}
            color={category.id === visibleCategory ? 'primary.500' : 'inherit'}
            borderRadius="md"
            p={2}
            cursor="pointer"
            onClick={() => handleTabClick(category.id)}
            fontWeight={category.id === visibleCategory ? "semibold" : "normal"}
            transition="all 0.2s"
            _hover={{ bg: activeBgColor }}
            as={motion.div}
            whileTap={{ scale: 0.98 }}
          >
            <Flex align="center">
              {category.icon && <Box mr={2}>{category.icon}</Box>}
              <Text>{category.label}</Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default CategoryTabs;
