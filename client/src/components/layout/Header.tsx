import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { HStack } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { InputGroup } from '@chakra-ui/input';
import { InputLeftElement } from '@chakra-ui/input';
import { Menu } from '@chakra-ui/menu';
import { MenuButton } from '@chakra-ui/menu';
import { MenuItem } from '@chakra-ui/menu';
import { MenuList } from '@chakra-ui/menu';
import { Text } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Drawer } from '@chakra-ui/modal';
import { DrawerBody } from '@chakra-ui/modal';
import { DrawerContent } from '@chakra-ui/modal';
import { DrawerHeader } from '@chakra-ui/modal';
import { DrawerOverlay } from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import { VStack } from '@chakra-ui/layout';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';

/**
 * Application header component with navigation
 * Rubik's × Sushi Shop themed black navigation bar with scroll effect
 * Includes responsive mobile navigation with drawer for smaller devices
 */
const Header = (): React.ReactElement => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  
  // Access auth and cart stores
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openCart, totalItems } = useCartStore();
  
  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links data for DRY code
  const navLinks = [
    { path: '/menu', label: 'Carte' },
    { path: '/shops', label: 'Nos Shops' },
    { path: '/about', label: 'À propos' },
  ];

  // Logo component for reuse
  const Logo = () => (
    <RouterLink to="/">
      <Flex align="center">
        <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.95 }}>
          <Box 
            w={{ base: "26px", md: "30px" }} 
            h={{ base: "26px", md: "30px" }} 
            borderRadius="full" 
            bg="gray.200"
            mr={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            color="black"
          >
            R
          </Box>
        </motion.div>
      </Flex>
    </RouterLink>
  );

  // Navigation link component for reuse
  const NavLink = ({ path, label }: { path: string; label: string }) => (
    <RouterLink to={path}>
      <Text 
        fontSize="sm" 
        fontWeight="medium"
        textDecoration={location.pathname === path ? 'underline' : 'none'}
        textUnderlineOffset="4px"
        _hover={{ textDecoration: 'underline' }}
      >
        {label}
      </Text>
    </RouterLink>
  );

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={scrolled ? 'rgba(0, 0, 0, 0.95)' : 'black'}
      color="white"
      boxShadow={scrolled ? 'lg' : 'md'}
      w="100%"
      transition="all 0.3s ease-in-out"
      backdropFilter={scrolled ? 'blur(10px)' : 'none'}
      borderBottom={scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'}
      h={{ base: "60px", md: "70px" }}
    >
      <Container maxW="container.xl" h="100%">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          h="100%"
          w="100%"
        >
          {/* Left Section - Logo and Main Nav */}
          <HStack spacing={{ base: 3, md: 6 }}>
            {/* Logo */}
            <Logo />

            {/* Main Navigation Links (desktop only) */}
            <HStack spacing={4} display={{ base: "none", md: "flex" }}>
              {navLinks.map((link) => (
                <NavLink key={link.path} path={link.path} label={link.label} />
              ))}
            </HStack>
            
            {/* Mobile Menu Button */}
            <IconButton
              ref={btnRef}
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              variant="ghost"
              color="white"
              icon={
                <Box fontSize="xl">☰</Box>
              }
              onClick={onOpen}
              _hover={{ bg: "gray.800" }}
            />
          </HStack>

          {/* Middle Section - Location Search */}
          <Box
            display={{ base: 'none', md: 'flex' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            w={{ md: "250px", lg: "300px" }}
          >
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Box as="span" color="gray.400">
                  ○
                </Box>
              </InputLeftElement>
              <Input
                placeholder="Saisissez une adresse de livraison"
                bg="gray.800"
                border="none"
                borderRadius="full"
                size="sm"
                color="white"
                _placeholder={{ color: 'gray.400', fontSize: 'xs' }}
                _focus={{ boxShadow: '0 0 0 1px #ffde00' }}
              />
            </InputGroup>
          </Box>

          {/* Right Section - Auth & Cart */}
          <HStack spacing={{ base: 2, md: 4 }}>
            {/* Cart Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                aria-label="Shopping cart"
                icon={
                  <Box position="relative">
                    <svg
                      fill="currentColor"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    {totalItems > 0 && (
                      <Box
                        position="absolute"
                        top="-6px"
                        right="-6px"
                        bg="#ffde00"
                        color="black"
                        borderRadius="full"
                        w="16px"
                        h="16px"
                        fontSize="10px"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {totalItems}
                      </Box>
                    )}
                  </Box>
                }
                onClick={() => {
                  console.log('Opening cart...');
                  openCart();
                }}
                variant="solid"
                colorScheme="yellow"
                color="black"
                size="md"
                _hover={{ bg: 'yellow.400' }}
              />
            </motion.div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Menu placement="bottom-end">
                <MenuButton as={Button} variant="ghost" color="white" size="sm" _hover={{ bg: 'gray.800' }}>
                  {user?.firstName}
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                    <RouterLink to="/profile">Mon profil</RouterLink>
                  </MenuItem>
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                    <RouterLink to="/orders">Mes commandes</RouterLink>
                  </MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                      <RouterLink to="/admin">Admin</RouterLink>
                    </MenuItem>
                  )}
                  <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} onClick={logout}>Déconnexion</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={2}>
                <RouterLink to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    color="white" 
                    fontWeight="medium"
                    _hover={{ bg: 'gray.800' }}
                    display={{ base: 'none', sm: 'inline-flex' }}
                  >
                    Me connecter
                  </Button>
                </RouterLink>
                <RouterLink to="/register">
                  <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    size="sm"
                    bg="transparent"
                    border="1px solid white"
                    color="white"
                    fontWeight="medium"
                    _hover={{ bg: 'gray.800' }}
                    borderRadius="sm"
                  >
                    Panier (0)
                  </Button>
                </RouterLink>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
        <DrawerContent bg="black" color="white" maxW="250px">
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.300">
            <Flex justify="space-between" align="center">
              <Logo />
              <IconButton
                variant="ghost"
                color="white"
                icon={<Box fontSize="md">✕</Box>}
                aria-label="Close menu"
                size="sm"
                onClick={onClose}
                _hover={{ bg: "gray.800" }}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody py={4}>
            <VStack align="stretch" spacing={5}>
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <RouterLink key={link.path} to={link.path} onClick={onClose}>
                  <Text 
                    fontSize="md" 
                    fontWeight="medium"
                    py={1}
                    pl={1}
                    borderLeft={location.pathname === link.path ? "2px solid #ffde00" : "2px solid transparent"}
                    _hover={{ borderLeft: "2px solid #ffde00" }}
                  >
                    {link.label}
                  </Text>
                </RouterLink>
              ))}
              
              {/* Mobile location search */}
              <Box pt={4}>
                <Text fontSize="xs" color="gray.400" mb={2}>LIVRAISON</Text>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Box as="span" color="gray.400">
                      ○
                    </Box>
                  </InputLeftElement>
                  <Input
                    placeholder="Adresse de livraison"
                    bg="gray.800"
                    border="none"
                    borderRadius="md"
                    size="sm"
                    color="white"
                    _placeholder={{ color: 'gray.400', fontSize: 'xs' }}
                    _focus={{ boxShadow: '0 0 0 1px #ffde00' }}
                  />
                </InputGroup>
              </Box>
              
              {/* Authentication Links */}
              <Box pt={4}>
                <Text fontSize="xs" color="gray.400" mb={2}>COMPTE</Text>
                <VStack align="stretch" spacing={3}>
                  {isAuthenticated ? (
                    <>
                      <RouterLink to="/profile" onClick={onClose}>
                        <Text fontSize="md">Mon profil</Text>
                      </RouterLink>
                      <RouterLink to="/orders" onClick={onClose}>
                        <Text fontSize="md">Mes commandes</Text>
                      </RouterLink>
                      {user?.role === 'admin' && (
                        <RouterLink to="/admin" onClick={onClose}>
                          <Text fontSize="md">Admin</Text>
                        </RouterLink>
                      )}
                      <Button variant="outline" size="sm" onClick={() => { logout(); onClose(); }}>Déconnexion</Button>
                    </>
                  ) : (
                    <>
                      <RouterLink to="/login" onClick={onClose}>
                        <Button variant="outline" size="sm" width="full">Me connecter</Button>
                      </RouterLink>
                      <RouterLink to="/register" onClick={onClose}>
                        <Button variant="solid" colorScheme="yellow" size="sm" width="full">Créer un compte</Button>
                      </RouterLink>
                    </>
                  )}
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
