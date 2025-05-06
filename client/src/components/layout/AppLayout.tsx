import { Box } from '@chakra-ui/layout';
import { useColorMode } from '@chakra-ui/color-mode';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import Footer from './Footer';
import Header from './Header';
import CartSidebar from '../cart/CartSidebar';
import useCartStore from '../../stores/cartStore';

/**
 * Main application layout component for Rubik's × Sushi Shop theme
 * Provides consistent structure with header, main content area, and footer
 * Includes smooth page transitions using framer-motion
 */
const AppLayout = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  
  // Get cart state from store
  const cartStore = useCartStore();
  const [isCartVisible, setIsCartVisible] = useState(false);
  
  // Observer les changements d'état du panier dans le store
  useEffect(() => {
    if (cartStore.isOpen) {
      setIsCartVisible(true);
    }
  }, [cartStore.isOpen]);
  
  // Fonction pour fermer le panier
  const handleCloseCart = () => {
    setIsCartVisible(false);
    cartStore.closeCart();
  };

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    out: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg={colorMode === 'dark' ? '#121212' : 'white'}
      width="100%"
      maxWidth="100vw"
      margin="0"
      padding="0"
      overflowX="hidden"
    >
      <Header />
      <Box 
        as="main" 
        flex="1"
        bgColor="transparent"
        pt={{ base: "60px", md: "70px" }} // Responsive padding top to compensate for fixed header
        px={{ base: 2, md: 4 }} // Responsive horizontal padding
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            style={{ width: '100%', height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
      <Footer />
      
      {/* Cart Sidebar - utilisation d'un état local et du store */}
      <CartSidebar isOpen={isCartVisible || cartStore.isOpen} onClose={handleCloseCart} />
    </Box>
  );
};

export default AppLayout;
