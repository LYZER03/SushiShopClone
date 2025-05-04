import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

/**
 * Error page component displayed when route errors occur
 * Provides user-friendly error messages and navigation options
 */
const ErrorPage = (): JSX.Element => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Extract error message based on error type
  let errorMessage = 'An unexpected error has occurred.';
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || errorMessage;
    if (error.status === 404) {
      errorMessage = 'The page you are looking for does not exist.';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Handle navigation back
  const handleGoBack = (): void => {
    navigate(-1);
  };

  // Handle navigation to home
  const handleGoHome = (): void => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={6}
    >
      <VStack spacing={8} maxW="md">
        <Image
          src={
            statusCode === 404
              ? 'https://illustrations.popsy.co/amber/crashed-error.svg'
              : 'https://illustrations.popsy.co/amber/internet-error.svg'
          }
          alt="Error illustration"
          maxW="200px"
          fallbackSrc="https://via.placeholder.com/200x200?text=Error"
        />

        <Heading
          as="h1"
          fontSize="4xl"
          fontWeight="bold"
          color="secondary.700"
          lineHeight="1.2"
        >
          {statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong'}
        </Heading>

        <Text fontSize="lg" color="gray.600">
          {errorMessage}
        </Text>

        <Box>
          <Button
            colorScheme="primary"
            size="lg"
            mr={4}
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            colorScheme="secondary"
            size="lg"
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ErrorPage;
