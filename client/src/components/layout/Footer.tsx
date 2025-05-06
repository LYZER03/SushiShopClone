import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Link } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { useColorMode } from '@chakra-ui/color-mode';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Footer component for Rubik's × Sushi Shop
 * Themed footer with navigation links, contact info, and copyright
 * Includes responsive design and subtle animations
 */
const Footer = (): React.ReactElement => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'black' : '#121212';
  const textColor = 'white';
  const accentColor = '#ffde00'; // Yellow from Rubik's cube theme
  
  // Animation variants for links
  const linkHoverMotion = {
    rest: { x: 0 },
    hover: { x: 3, transition: { duration: 0.2 } }
  };
  
  // Enhanced link component with animation
  const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Box as={motion.div} initial="rest" whileHover="hover" variants={linkHoverMotion}>
      <Link 
        as={RouterLink} 
        to={href} 
        fontSize="sm" 
        opacity={0.8} 
        _hover={{ opacity: 1, color: accentColor }}
        display="inline-block"
      >
        {children}
      </Link>
    </Box>
  );
  
  return (
    <Box
      as="footer"
      bg={bgColor}
      color={textColor}
      pt={{ base: 8, md: 10 }}
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="container.xl" py={{ base: 6, md: 8 }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 6, md: 8 }}
        >
          <Stack align={{ base: "center", sm: "flex-start" }} spacing={3}>
            <Text fontWeight="600" fontSize="sm" color={accentColor} textTransform="uppercase" mb={1}>
              RUBIK'S × SUSHISHOP
            </Text>
            <FooterLink href="/about">À propos</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/careers">Recrutement</FooterLink>
          </Stack>

          <Stack align={{ base: "center", sm: "flex-start" }} spacing={3}>
            <Text fontWeight="600" fontSize="sm" color={accentColor} textTransform="uppercase" mb={1}>
              SERVICE CLIENT
            </Text>
            <FooterLink href="/help">Aide</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/terms">Conditions générales</FooterLink>
            <FooterLink href="/privacy">Politique de confidentialité</FooterLink>
          </Stack>

          <Stack align={{ base: "center", sm: "flex-start" }} spacing={3}>
            <Text fontWeight="600" fontSize="sm" color={accentColor} textTransform="uppercase" mb={1}>
              LIVRAISON
            </Text>
            <FooterLink href="/delivery-areas">Zones de livraison</FooterLink>
            <FooterLink href="/delivery-times">Horaires de livraison</FooterLink>
            <FooterLink href="/track-order">Suivre ma commande</FooterLink>
          </Stack>

          <Stack align={{ base: "center", sm: "flex-start" }} spacing={3}>
            <Text fontWeight="600" fontSize="sm" color={accentColor} textTransform="uppercase" mb={1}>
              SUIVEZ-NOUS
            </Text>
            <Flex direction="row" gap={4} justify={{ base: "center", sm: "flex-start" }}>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" opacity={0.8} _hover={{ opacity: 1 }}>
                  <Box as="span" fontSize="lg">📷</Box>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" opacity={0.8} _hover={{ opacity: 1 }}>
                  <Box as="span" fontSize="lg">👍</Box>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" opacity={0.8} _hover={{ opacity: 1 }}>
                  <Box as="span" fontSize="lg">🐦</Box>
                </Link>
              </motion.div>
            </Flex>
          </Stack>
        </SimpleGrid>
      </Container>

      <Divider borderColor="gray.800" mt={{ base: 6, md: 8 }} />
      
      <Box py={{ base: 4, md: 6 }} mt={2}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center"
            gap={4}
          >
            <Flex align="center" gap={2}>
              <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.95 }}>
                <Box 
                  w="24px" 
                  h="24px" 
                  borderRadius="full" 
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  fontWeight="bold"
                  color="black"
                >
                  R
                </Box>
              </motion.div>
              <Text fontWeight="600" fontSize="sm">
                RUBIK'S × SUSHISHOP
              </Text>
            </Flex>
            <Text fontSize="xs" opacity={0.6} textAlign={{ base: "center", md: "right" }}>
              © {new Date().getFullYear()} Rubik's × Sushi Shop. Tous droits réservés.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
