import { Box, Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

/**
 * Main App component
 * Provides the router with Suspense for lazy-loaded components
 */
function App(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
        >
          <Spinner 
            size="xl" 
            color="primary.500" 
            /* Removed thickness prop as it's not supported in Chakra UI v3 */
          />
        </Box>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
