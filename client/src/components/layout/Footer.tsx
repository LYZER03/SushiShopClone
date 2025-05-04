import {
  Box,
  Container,
  Flex,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

/**
 * Footer component for the application
 * Contains navigation links, contact info, and copyright
 */
const Footer = (): React.ReactElement => {
  return (
    <Box
      bg={'gray.50'}
      color={'gray.700'}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor={'gray.200'}
    >
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={8}
        >
          <Stack align="flex-start">
            <Text fontWeight="500" fontSize="lg" mb={2}>
              Company
            </Text>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/careers">Careers</Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="500" fontSize="lg" mb={2}>
              Support
            </Text>
            <Link href="/help">Help Center</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="500" fontSize="lg" mb={2}>
              Delivery
            </Text>
            <Link href="/delivery-areas">Delivery Areas</Link>
            <Link href="/delivery-times">Delivery Times</Link>
            <Link href="/track-order">Track Your Order</Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="500" fontSize="lg" mb={2}>
              Connect With Us
            </Text>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box py={5}>
        <Flex
          align="center"
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}
        >
          <Text fontWeight="600" fontSize="lg">
            SUSHI SHOP
          </Text>
        </Flex>
        <Text pt={6} fontSize="sm" textAlign="center">
          © {new Date().getFullYear()} Sushi Shop. All rights reserved
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
