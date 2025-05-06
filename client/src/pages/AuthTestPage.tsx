import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Code,
} from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Container } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';

import useAuthStore from '../stores/authStore';
import { authApi } from '../api/client';
import { LoginForm, RegisterForm } from '../components/auth';
import { useNavigate } from 'react-router-dom';

/**
 * Test page for authentication functionality
 * This page provides UI to test different aspects of the authentication system
 */
const AuthTestPage = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [showComponents, setShowComponents] = useState(false);
  
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    accessToken, 
    login, 
    logout, 
    register,
    getProfile
  } = useAuthStore();

  // Helper to log test results
  const logResult = (message: string) => {
    setTestResults(prev => [message, ...prev]);
    console.log(message);
  };

  // Test authentication store state
  const testAuthStore = () => {
    logResult('------ Auth Store Test ------');
    logResult(`isAuthenticated: ${isAuthenticated}`);
    logResult(`accessToken: ${accessToken ? 'Present' : 'Not present'}`);
    logResult(`User data: ${user ? JSON.stringify(user) : 'No user'}`);
  };

  // Test login functionality
  const testLogin = async () => {
    logResult('------ Login Test ------');
    logResult(`Attempting login with: ${email}`);
    
    try {
      const success = await login(email, password);
      logResult(`Login result: ${success ? 'Success' : 'Failed'}`);
      
      // Check store after login
      testAuthStore();
    } catch (error) {
      logResult(`Login error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test registration functionality
  const testRegister = async () => {
    logResult('------ Register Test ------');
    logResult(`Attempting registration for: ${email}`);
    
    try {
      const success = await register(firstName, lastName, email, password);
      logResult(`Registration result: ${success ? 'Success' : 'Failed'}`);
      
      // Check store after registration
      testAuthStore();
    } catch (error) {
      logResult(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test profile fetch functionality
  const testGetProfile = async () => {
    logResult('------ Get Profile Test ------');
    
    try {
      const profile = await getProfile();
      logResult(`Profile fetch result: ${profile ? JSON.stringify(profile) : 'Failed to fetch profile'}`);
    } catch (error) {
      logResult(`Get profile error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Test direct API calls
  const testDirectApiCall = async () => {
    logResult('------ Direct API Call Test ------');
    
    try {
      // Test login endpoint
      const response = await authApi.login({ email, password });
      logResult(`API login response: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      logResult(`API error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Test logout functionality
  const testLogout = () => {
    logResult('------ Logout Test ------');
    logout();
    logResult('Logout executed');
    
    // Check store after logout
    testAuthStore();
  };
  
  // Clear test logs
  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Authentication Test Page</Heading>
        <Text>Use this page to test the authentication functionality</Text>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <VStack align="start" spacing={4}>
            <Heading as="h2" size="md">Test Credentials</Heading>
            
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
              />
            </FormControl>
          </VStack>
        </Box>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <Heading as="h2" size="md">Test API Functions</Heading>
            
            <HStack spacing={4}>
              <Button colorScheme="blue" onClick={testLogin}>
                Test Login
              </Button>
              <Button colorScheme="green" onClick={testRegister}>
                Test Register
              </Button>
              <Button colorScheme="purple" onClick={testGetProfile}>
                Test Get Profile
              </Button>
              <Button colorScheme="orange" onClick={testDirectApiCall}>
                Test Direct API
              </Button>
              <Button colorScheme="red" onClick={testLogout}>
                Test Logout
              </Button>
            </HStack>
            
            <Button onClick={testAuthStore}>
              Check Auth Store State
            </Button>
          </VStack>
        </Box>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading as="h2" size="md">Components Test</Heading>
              <Button onClick={() => setShowComponents(!showComponents)}>
                {showComponents ? 'Hide Components' : 'Show Components'}
              </Button>
            </HStack>
            
            {showComponents && (
              <>
                <Divider />
                <Heading as="h3" size="sm">Login Form</Heading>
                <LoginForm redirectPath="/auth-test" />
                
                <Divider />
                <Heading as="h3" size="sm">Register Form</Heading>
                <RegisterForm redirectPath="/auth-test" />
              </>
            )}
          </VStack>
        </Box>
        
        <Box p={4} borderWidth={1} borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading as="h2" size="md">Test Results</Heading>
              <Button onClick={clearLogs}>Clear Logs</Button>
            </HStack>
            
            <Box
              bg="gray.50"
              p={3}
              borderRadius="md"
              maxHeight="300px"
              overflowY="auto"
            >
              {testResults.length === 0 ? (
                <Text color="gray.500">No test results yet. Run a test to see results here.</Text>
              ) : (
                testResults.map((result, index) => (
                  <Code key={index} display="block" p={1} my={1} fontSize="sm">
                    {result}
                  </Code>
                ))
              )}
            </Box>
          </VStack>
        </Box>
        
        <Button onClick={() => navigate('/login')} colorScheme="blue">
          Go to Login Page
        </Button>
      </VStack>
    </Container>
  );
};

export default AuthTestPage;
