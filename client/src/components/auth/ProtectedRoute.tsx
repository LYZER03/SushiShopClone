import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import useAuthStore from '../../stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'customer' | 'staff' | 'admin'>;
  redirectPath?: string;
}

/**
 * Protected Route component
 * 
 * Ensures that only authenticated users can access certain routes.
 * Optionally, it can also restrict access based on user roles.
 * If the user is not authenticated, they will be redirected to the login page.
 * 
 * @param children The protected content to render
 * @param allowedRoles Optional list of roles that can access this route
 * @param redirectPath Path to redirect unauthenticated users (default: /login)
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectPath = '/login'
}: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, user, getProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If user is not already loaded, try to fetch profile
        if (!user && isAuthenticated) {
          await getProfile();
        }
        
        // Check if user is authenticated
        if (!isAuthenticated) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        // Check role-based access if roles are specified
        if (allowedRoles?.length && user) {
          setIsAuthorized(allowedRoles.includes(user.role));
        } else {
          // If no roles specified, any authenticated user is authorized
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, getProfile, allowedRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Center minH="70vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text>Verifying your access...</Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Show unauthorized message if authenticated but not authorized by role
  if (!isAuthorized) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Access Denied
        </Text>
        <Text>
          You don't have the required permissions to access this page.
        </Text>
      </Box>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
