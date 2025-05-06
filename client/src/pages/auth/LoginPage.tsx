import { Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Link as ChakraLink } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';

import { AuthLayout, LoginForm } from '../../components/auth';

/**
 * Login page component
 * Provides user authentication form and social login options
 */
const LoginPage = (): JSX.Element => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <Stack spacing={6}>
        <LoginForm />
        
        <Box textAlign="right">
          <ChakraLink as={RouterLink} to="/forgot-password" color="primary.500">
            Forgot password?
          </ChakraLink>
        </Box>

        <Box my={4}>
          <Divider />
          <Text textAlign="center" my={4} color="gray.500">
            Or sign in with
          </Text>
          <Stack direction="row" spacing={4}>
            <Button
              variant="outline"
              isFullWidth
              leftIcon={
                <Box as="span" fontSize="1.5em">
                  G
                </Box>
              }
            >
              Google
            </Button>
            <Button
              variant="outline"
              isFullWidth
              leftIcon={
                <Box as="span" fontSize="1.5em">
                  f
                </Box>
              }
            >
              Facebook
            </Button>
          </Stack>
        </Box>

        <Text mt={4} textAlign="center">
          Don't have an account?{' '}
          <ChakraLink as={RouterLink} to="/register" color="primary.500">
            Sign up
          </ChakraLink>
        </Text>
      </Stack>
    </AuthLayout>
  );
};

export default LoginPage;
