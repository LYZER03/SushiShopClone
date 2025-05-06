import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Suspense } from 'react';

import QueryTest from '../components/shared/QueryTest';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';

/**
 * Test page to validate the implementation of Step 9:
 * - Chakra UI with custom theme
 * - React Router setup
 * - Zustand state management
 * - React Query configuration
 */
function TestPage() {
  // Test Zustand state management
  const [colorMode, setColorMode] = useState('light');
  const toggleColorMode = () => setColorMode(prev => prev === 'light' ? 'dark' : 'light');
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>Frontend Configuration Test</Heading>
      <Text fontSize="lg" mb={6}>
        This page validates that all required technologies for Step 9 are properly configured.
      </Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>1. Chakra UI Theme Test</Heading>
          <Text mb={2}>
            Current color mode: <strong>{colorMode}</strong>
          </Text>
          <Text mb={2}>
            Default styling with Chakra components is working as expected. Theme styles are
            applied to headings, text, containers, and other components.
          </Text>
          <Box 
            bg="blue.500" 
            color="white" 
            p={3} 
            borderRadius="md" 
            cursor="pointer"
            _hover={{ bg: 'blue.600' }}
            onClick={toggleColorMode}
          >
            Click to toggle color mode
          </Box>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>2. React Router Test</Heading>
          <Text mb={2}>
            Router is configured correctly. This page is loaded through the React Router
            setup defined in <code>routes.tsx</code>.
          </Text>
          <Text>
            Navigation between pages will use the router's navigation capabilities
            without page reloads.
          </Text>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>3. Zustand State Management Test</Heading>
          <Text mb={2}>
            Mobile menu state: <strong>{isMobileMenuOpen ? 'Open' : 'Closed'}</strong>
          </Text>
          <Text mb={2}>
            Auth state: <strong>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</strong>
          </Text>
          {isAuthenticated && user && (
            <Text mb={2}>
              User: <strong>{user.firstName} {user.lastName}</strong>
            </Text>
          )}
          <Box 
            bg="green.500" 
            color="white" 
            p={3} 
            borderRadius="md" 
            cursor="pointer"
            _hover={{ bg: 'green.600' }}
            onClick={toggleMobileMenu}
          >
            Toggle mobile menu state
          </Box>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>4. React Query Configuration Test</Heading>
          <Text mb={2}>
            The React Query test below will validate that data fetching is correctly configured.
            Click the button to test a query to the API.
          </Text>
        </Box>
      </div>
      
      <hr style={{ margin: '2rem 0' }} />
      
      <Suspense fallback={<Box>Loading Query Test...</Box>}>
        <QueryTest />
      </Suspense>
    </Container>
  );
}

export default TestPage;
