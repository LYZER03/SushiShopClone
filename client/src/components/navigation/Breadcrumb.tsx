import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Link } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

export interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component for navigation context
 * Displays the current navigation path with clickable links
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Flex 
      py={2} 
      px={4} 
      fontSize="sm" 
      color="gray.600" 
      alignItems="center"
      flexWrap="wrap"
      mb={4}
      bg="gray.50"
      borderRadius="md"
    >
      {items.map((item, index) => {
        // Last item shouldn't be clickable
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.path}>
            {isLast ? (
              <Text fontWeight="medium" color="gray.800">
                {item.label}
              </Text>
            ) : (
              <Link
                as={RouterLink}
                to={item.path}
                _hover={{ textDecoration: 'underline', color: 'primary.500' }}
                color="gray.600"
              >
                {item.label}
              </Link>
            )}
            
            {!isLast && (
              <Box mx={2} color="gray.400">
                <ChevronRightIcon />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

/**
 * Generate breadcrumb items from a URL path
 * @param path - The current URL path
 * @param pathMap - Map of paths to their display names
 */
export const generateBreadcrumbs = (
  path: string,
  pathMap: Record<string, string> = {}
): BreadcrumbItem[] => {
  // Split the path into segments
  const segments = path.split('/').filter(segment => segment);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always include home
  breadcrumbs.push({
    label: 'Menu',
    path: '/',
  });
  
  // Build the breadcrumb items
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Use custom name from pathMap or capitalize the segment
    const label = pathMap[segment] || 
      segment.charAt(0).toUpperCase() + 
      segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      label,
      path: currentPath,
      isCurrentPage: isLast
    });
  });
  
  return breadcrumbs;
};

export default Breadcrumb;
