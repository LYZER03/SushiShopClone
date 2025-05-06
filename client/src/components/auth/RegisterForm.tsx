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
import { Flex } from '@chakra-ui/layout';
import useAuthStore from '../../stores/authStore';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

/**
 * Registration form component
 * Handles user registration and form validation
 */
const RegisterForm = ({ onSuccess, redirectPath = '/login' }: RegisterFormProps): JSX.Element => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get register function and state from auth store
  const { register, isLoading, error, clearError } = useAuthStore();

  // Validate form input
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      const success = await register(firstName, lastName, email, password);
      
      if (success) {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created',
          status: 'success',
          duration: 5000,
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

        <Flex gap={4} width="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isInvalid={!!errors.firstName} isRequired>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.lastName} isRequired>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
        </Flex>
        
        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={!!errors.password} isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={!!errors.confirmPassword} isRequired>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          isLoading={isLoading}
          isFullWidth
          mt={4}
        >
          Create Account
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;
