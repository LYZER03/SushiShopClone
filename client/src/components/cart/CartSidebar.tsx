import React, { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { CloseButton } from '@chakra-ui/close-button';
import { HStack } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { IconButton } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import useCartStore from '../../stores/cartStore';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types/cart.types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Floating Cart Sidebar Component
 * Displays cart items, total, and checkout options
 * Transforms into login form if user tries to checkout while not logged in
 */
const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Get cart items and functions from cart store
  const { items, removeItem, addItem } = useCartStore();
  // Calculate total from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Function to update item quantity
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      removeItem(itemId);
      // Add item back with new quantity
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      } as CartItem, newQuantity);
    }
  };
  
  // Get auth state and functions from auth store
  const { user, login } = useAuthStore();
  const isLoggedIn = !!user;
  
  // Handle quantity change
  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity);
      } else {
        removeItem(itemId);
      }
    }
  };
  
  // Handle continue to checkout button
  const handleContinue = () => {
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      setShowLoginForm(true);
    }
  };
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password); // Pass email and password as separate parameters
    setShowLoginForm(false);
  };

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "100%", 
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Box 
          position="fixed"
          top="0"
          right="0"
          bottom="0"
          zIndex={2000}
          pointerEvents="none"
          width="100%"
        >
          {/* Backdrop - rendu transparent sans fermeture au clic */}
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="transparent"
            as={motion.div}
            pointerEvents="none"
          />
          
          {/* Sidebar */}
          <Box
            as={motion.div}
            position="absolute"
            height="100%"
            width="100%"
            maxW={{ base: "100%", sm: "420px" }}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            right="0"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            display="flex"
            flexDirection="column"
            boxShadow="-10px 0 30px rgba(0, 0, 0, 0.15)"
            borderLeft="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            pointerEvents="auto"
          >
            <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
              <Heading size="md">
                {showLoginForm ? 'Sign In to Continue' : 'Panier'}
              </Heading>
              <CloseButton onClick={onClose} />
            </Flex>
            
            <Box flex="1" overflowY="auto" p={4}>
              <AnimatePresence>
                {showLoginForm ? (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin}
                  >
                    <VStack spacing={4} align="stretch">
                      <Text mb={4}>Please sign in to continue to checkout</Text>
                      
                      <Box>
                        <Text mb={2} fontSize="sm">Email</Text>
                        <Input 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          required
                        />
                      </Box>
                      
                      <Box>
                        <Text mb={2} fontSize="sm">Password</Text>
                        <Input 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          required
                        />
                      </Box>
                      
                      <Button type="submit" colorScheme="primary" mt={2}>
                        Sign In
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShowLoginForm(false)}
                      >
                        Back to Cart
                      </Button>
                      
                      <Divider />
                      
                      <Text fontSize="sm">
                        Don't have an account?
                      </Text>
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/signup')}
                      >
                        Create an Account
                      </Button>
                    </VStack>
                  </motion.form>
                ) : (
                  <motion.div
                    key="cart-items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {items.length === 0 ? (
                      <Flex 
                        direction="column" 
                        align="center" 
                        justify="center" 
                        h="200px"
                        color="gray.500"
                      >
                        <FiShoppingCart size={48} />
                        <Text mt={4}>Your cart is empty</Text>
                        <Button 
                          mt={4} 
                          colorScheme="primary" 
                          size="sm"
                          onClick={() => navigate('/menu')}
                        >
                          Browse Menu
                        </Button>
                      </Flex>
                    ) : (
                      <VStack spacing={4} align="stretch" divider={<Divider />}>
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ delay: index * 0.05 }}
                          >
                            <Flex justify="space-between">
                              <Box>
                                <Text fontWeight="medium">{item.name}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {item.price.toFixed(2)} € ({item.quantity} {item.quantity > 1 ? 'pieces' : 'piece'})
                                </Text>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                  leftIcon={<FiTrash2 />}
                                  mt={1}
                                  onClick={() => removeItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </Box>
                              
                              <HStack>
                                <IconButton
                                  aria-label="Decrease quantity"
                                  icon={<FiMinus />}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                />
                                <Text fontWeight="medium" minW="30px" textAlign="center">
                                  {item.quantity}
                                </Text>
                                <IconButton
                                  aria-label="Increase quantity"
                                  icon={<FiPlus />}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                />
                              </HStack>
                            </Flex>
                          </motion.div>
                        ))}
                      </VStack>
                    )}
                    
                    {items.length > 0 && (
                      <>
                        <Box mt={6}>
                          <Flex direction="column" gap={2}>
                            <Text fontSize="sm" fontWeight="medium">
                              Saisissez votre bon de réduction
                            </Text>
                            <Flex>
                              <Input
                                placeholder="Promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                mr={2}
                              />
                              <Button size="md" variant="outline">
                                Apply
                              </Button>
                            </Flex>
                          </Flex>
                        </Box>
                        
                        <Divider my={6} />
                        
                        <Flex justify="space-between" fontWeight="bold" mb={6}>
                          <Text>Total</Text>
                          <Text>{total.toFixed(2)} €</Text>
                        </Flex>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            
            {!showLoginForm && items.length > 0 && (
              <Box p={4} borderTopWidth="1px">
                <Button 
                  colorScheme="primary" 
                  size="lg" 
                  width="100%"
                  onClick={handleContinue}
                >
                  Continuer • {total.toFixed(2)} €
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
