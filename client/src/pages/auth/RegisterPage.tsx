import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Link as ChakraLink } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';

import { AuthLayout, RegisterForm } from '../../components/auth';

/**
 * RegisterPage component for user registration
 */
const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join us to enjoy special offers and a personalized sushi experience"
    >
      <RegisterForm />
      
      <Box mt={6} textAlign="center">
        <Text>
          Already have an account?{' '}
          <ChakraLink as={RouterLink} to="/login" color="primary.500">
            Sign in
          </ChakraLink>
        </Text>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
