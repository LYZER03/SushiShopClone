import React from 'react';
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterPage component for user registration
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Create an Account
        </Heading>
        
        <Text color="gray.600" textAlign="center">
          Join us to enjoy special offers and a personalized sushi experience
        </Text>
        
        <Box bg="white" p={8} borderRadius="md" boxShadow="md">
          <VStack as="form" spacing={6}>
            <Flex gap={4} width="100%" direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input placeholder="Enter your first name" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input placeholder="Enter your last name" />
              </FormControl>
            </Flex>
            
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your email" />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Create a password" />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" placeholder="Confirm your password" />
            </FormControl>
            
            <Button colorScheme="primary" size="lg" width="full" mt={4}>
              Register
            </Button>
            
            <Text textAlign="center">
              Already have an account?{' '}
              <Text 
                as="span" 
                color="primary.500" 
                fontWeight="bold" 
                cursor="pointer" 
                onClick={() => navigate('/login')}
              >
                Log in
              </Text>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default RegisterPage;
