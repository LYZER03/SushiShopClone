import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Text } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/layout';
import useAuthStore from '../../stores/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

/**
 * Login form component
 * Handles user authentication and form validation
 */
const LoginForm = ({ onSuccess, redirectPath = '/' }: LoginFormProps): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get login function and state from auth store
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectPath);
        }
      }
    }
  };

  return (
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="********"
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
          width="full"
        >
          Sign In
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
