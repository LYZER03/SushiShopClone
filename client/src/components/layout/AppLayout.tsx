import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

/**
 * Main application layout component
 * Provides consistent structure with header, main content area, and footer
 */
const AppLayout = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" py={8}>
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
