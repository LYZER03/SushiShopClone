import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import useAuthStore from '../../stores/authStore';

/**
 * Login page component
 * Provides user authentication form and social login options
 */
const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get login function from auth store
  const { login, isLoading, error, clearError } = useAuthStore();

  // Validate form input
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      try {
        await login(email, password);
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } catch (err) {
        // Error is handled in the auth store and displayed below
        console.error('Login error:', err);
      }
    }
  };

  return (
    <Box py={10} px={4}>
      <Center>
        <Card maxW="md" w="full" shadow="md" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading size="lg" textAlign="center" color="secondary.700">
              Welcome Back
            </Heading>
            <Text mt={2} color="gray.600" textAlign="center">
              Sign in to your account
            </Text>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {error && (
                  <Text color="red.500" textAlign="center">
                    {error}
                  </Text>
                )}

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Box textAlign="right">
                  <ChakraLink as={RouterLink} to="/forgot-password" color="primary.500">
                    Forgot password?
                  </ChakraLink>
                </Box>

                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  isFullWidth
                >
                  Sign In
                </Button>
              </Stack>
            </form>

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
          </CardBody>
        </Card>
      </Center>
    </Box>
  );
};

export default LoginPage;
