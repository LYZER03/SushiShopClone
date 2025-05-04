import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';

/**
 * Application header component with navigation
 * Provides links, cart, and authentication controls
 */
const Header = (): React.ReactElement => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Remove mobile nav for now to avoid linting errors
  // We'll re-implement this properly in a future step

  // Access auth and cart stores
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openCart, totalItems } = useCartStore();

  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={scrolled ? 'white' : 'transparent'}
      boxShadow={scrolled ? 'md' : 'none'}
      transition="all 0.3s ease-in-out"
      backdropFilter={scrolled ? 'blur(5px)' : 'none'}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        py={4}
        px={8}
      >
        {/* Logo */}
        <Flex align="center" mr={5}>
          <RouterLink to="/">
            <Image
              src="/logo-placeholder.png" // Replace with actual logo
              alt="Sushi Shop"
              height="40px"
              fallback={<Box bg="gray.200" width="150px" height="40px" display="flex" alignItems="center" justifyContent="center" fontSize="sm">Sushi Shop</Box>}
            />
          </RouterLink>
        </Flex>

        {/* Main Navigation - Desktop */}
        <HStack
          gap={8}
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
        >
          <RouterLink to="/">
            <Button
              variant="ghost"
              colorScheme={location.pathname === '/' ? 'primary' : undefined}
            >
              Home
            </Button>
          </RouterLink>
          <RouterLink to="/menu">
            <Button
              variant="ghost"
              colorScheme={
                location.pathname.startsWith('/menu') ? 'primary' : undefined
              }
            >
              Menu
            </Button>
          </RouterLink>
          <RouterLink to="/about">
            <Button
              variant="ghost"
              colorScheme={
                location.pathname === '/about' ? 'primary' : undefined
              }
            >
              About
            </Button>
          </RouterLink>
          <RouterLink to="/contact">
            <Button
              variant="ghost"
              colorScheme={
                location.pathname === '/contact' ? 'primary' : undefined
              }
            >
              Contact
            </Button>
          </RouterLink>
        </HStack>

        {/* Auth & Cart Controls */}
        <HStack gap={4}>
          {/* Cart Button */}
          <IconButton
            aria-label="Shopping cart"
            icon={
              <Box position="relative">
                <svg
                  fill="currentColor"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                {totalItems > 0 && (
                  <Box
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="primary.500"
                    color="white"
                    borderRadius="full"
                    w="18px"
                    h="18px"
                    fontSize="xs"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {totalItems}
                  </Box>
                )}
              </Box>
            }
            onClick={openCart}
            variant="ghost"
          />

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <Menu>
              <MenuButton as={Button} variant="ghost">
                Hi, {user?.firstName}
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <RouterLink to="/profile">My Profile</RouterLink>
                </MenuItem>
                <MenuItem>
                  <RouterLink to="/orders">My Orders</RouterLink>
                </MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem>
                    <RouterLink to="/admin">Admin Panel</RouterLink>
                  </MenuItem>
                )}
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <RouterLink to="/login">
                <Button variant="outline" colorScheme="primary">
                  Login
                </Button>
              </RouterLink>
              <RouterLink to="/register">
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  colorScheme="primary"
                >
                  Sign Up
                </Button>
              </RouterLink>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
