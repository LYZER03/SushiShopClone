import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**
 * Home page component
 * Serves as the landing page with featured items and CTAs
 */
const HomePage = (): JSX.Element => {
  return (
    <Box as="section">
      {/* Hero Section */}
      <Box
        bg="secondary.50"
        borderRadius="xl"
        overflow="hidden"
        mb={12}
        position="relative"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          py={{ base: 8, md: 10 }}
          px={{ base: 6, md: 10 }}
        >
          <Stack
            flex={1}
            spacing={{ base: 5, md: 10 }}
            maxW={{ base: 'full', md: '50%' }}
          >
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as="span"
                position="relative"
                color="primary.500"
                fontFamily="accent"
              >
                寿司
              </Text>
              <br />
              <Text as="span" color="secondary.500">
                Authentic Japanese Cuisine
              </Text>
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
              Experience the finest sushi prepared with fresh, premium
              ingredients. Our skilled chefs craft each piece with precision and
              care to deliver authentic flavors and a memorable dining
              experience.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                as={Link}
                to="/menu"
                rounded="md"
                size="lg"
                fontWeight="bold"
                px={6}
                colorScheme="primary"
              >
                View Menu
              </Button>
              <Button
                as={Link}
                to="/contact"
                rounded="md"
                size="lg"
                fontWeight="bold"
                px={6}
                variant="outline"
                colorScheme="secondary"
              >
                Contact Us
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
            mt={{ base: 10, md: 0 }}
          >
            <Box
              position="relative"
              height={{ base: '300px', md: '400px' }}
              width="full"
              overflow="hidden"
              borderRadius="xl"
            >
              <Image
                alt="Hero Image"
                fit="cover"
                align="center"
                w="100%"
                h="100%"
                src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                fallbackSrc="https://via.placeholder.com/600x400?text=Sushi"
              />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Featured Categories */}
      <Box as="section" py={10}>
        <VStack spacing={4} mb={8} textAlign="center">
          <Heading as="h2" size="xl" color="secondary.700">
            Our Popular Categories
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Explore our wide selection of sushi and Japanese cuisine
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {[
            {
              title: 'Nigiri',
              image:
                'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
              description:
                'Hand-pressed sushi with a slice of fish over vinegared rice',
            },
            {
              title: 'Maki Rolls',
              image:
                'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db',
              description:
                'Rolled sushi with seaweed outside, filled with rice and ingredients',
            },
            {
              title: 'Sashimi',
              image:
                'https://images.unsplash.com/photo-1584583570840-0d90148689ee',
              description:
                'Fresh, thinly sliced raw fish or meat served without rice',
            },
            {
              title: 'Poke Bowls',
              image:
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
              description:
                'Hawaiian-inspired bowls with raw fish, rice, and vegetables',
            },
          ].map((category, index) => (
            <Box
              key={index}
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
              }}
            >
              <Box h="200px" overflow="hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/300x200"
                />
              </Box>
              <Box p={5}>
                <Heading as="h3" size="md" mb={2}>
                  {category.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  {category.description}
                </Text>
                <Button
                  as={Link}
                  to={`/menu?category=${category.title.toLowerCase()}`}
                  colorScheme="primary"
                  size="sm"
                  variant="outline"
                >
                  Browse {category.title}
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* CTA Section */}
      <Container maxW="5xl" py={16}>
        <Flex
          bg="secondary.500"
          color="white"
          borderRadius="xl"
          overflow="hidden"
          direction={{ base: 'column', md: 'row' }}
        >
          <Box flex={1} p={10}>
            <Heading size="xl" mb={4}>
              First-time customer?
            </Heading>
            <Text fontSize="lg" mb={6}>
              Sign up today and get 15% off your first order with code SUSHI15
            </Text>
            <Button
              as={Link}
              to="/register"
              bg="white"
              color="secondary.500"
              _hover={{ bg: 'gray.100' }}
              size="lg"
            >
              Sign Up Now
            </Button>
          </Box>
          <Box
            flex={1}
            bg="secondary.600"
            position="relative"
            minH={{ base: '200px', md: '300px' }}
          >
            <Image
              alt="Sushi Platter"
              position="absolute"
              bottom={0}
              right={0}
              w="full"
              h="full"
              objectFit="cover"
              src="https://images.unsplash.com/photo-1553621042-f6e147245754"
              fallbackSrc="https://via.placeholder.com/600x400?text=Order+Now"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HomePage;
