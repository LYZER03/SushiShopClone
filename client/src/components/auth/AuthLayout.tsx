import { ReactNode } from 'react';
import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { useColorMode } from '@chakra-ui/color-mode';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Authentication Layout Component
 * 
 * Provides a consistent layout for authentication pages (login, register, password reset)
 * with a side image, branding, and centered content.
 */
const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps): JSX.Element => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.900';
  const cardBgColor = colorMode === 'light' ? 'white' : 'gray.800';
  
  return (
    <Flex
      minH="100vh"
      direction={{ base: 'column', md: 'row' }}
      bg={bgColor}
    >
      {/* Side image - only visible on larger screens */}
      <Flex
        flex={{ base: 0, md: 1 }}
        display={{ base: 'none', md: 'flex' }}
        bgGradient="linear(to-b, primary.400, primary.600)"
        position="relative"
        justify="center"
        align="center"
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          bottom="0"
          left="0"
          backgroundImage="url('/images/sushi-background.jpg')"
          backgroundSize="cover"
          backgroundPosition="center"
          opacity="0.4"
        />
        
        <Box
          p={8}
          textAlign="center"
          color="white"
          zIndex={1}
          maxW="md"
        >
          <Heading size="2xl" mb={6}>Sushi Shop</Heading>
          <Text fontSize="xl" fontWeight="medium">
            The freshest ingredients, delivered to your door
          </Text>
        </Box>
      </Flex>
      
      {/* Auth content area */}
      <Flex
        flex={{ base: 1, md: 1 }}
        p={{ base: 4, md: 8 }}
        align="center"
        justify="center"
      >
        <Container maxW="md">
          {/* Logo - only visible on mobile */}
          <Flex
            direction="column"
            align="center"
            mb={8}
            display={{ base: 'flex', md: 'none' }}
          >
            <Link to="/">
              <Image
                src="/images/logo.png"
                alt="Sushi Shop Logo"
                boxSize="80px"
                fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23555555'%3ESushi Shop%3C/text%3E%3C/svg%3E"
              />
            </Link>
          </Flex>
          
          {/* Card container */}
          <Box
            p={{ base: 6, md: 8 }}
            bg={cardBgColor}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading
              as="h1"
              size="xl"
              mb={2}
              textAlign="center"
              color="primary.700"
            >
              {title}
            </Heading>
            
            {subtitle && (
              <Text
                textAlign="center"
                color="gray.600"
                mb={6}
              >
                {subtitle}
              </Text>
            )}
            
            {children}
          </Box>
        </Container>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
