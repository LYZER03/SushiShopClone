import React from 'react';
import { Box, Container, Flex, Grid, GridItem, Heading, Image, Text, VStack } from '@chakra-ui/react';

/**
 * AboutPage component for displaying information about the restaurant
 */
const AboutPage: React.FC = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={12} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Our Story
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
            Discover the tradition, passion, and culinary expertise behind our journey 
            to bring authentic Japanese flavors to your table.
          </Text>
        </Box>
        
        {/* Our Mission */}
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          gap={8} 
          align="center"
        >
          <Box flex={1}>
            <Heading as="h2" size="xl" mb={4}>
              Our Mission
            </Heading>
            <Text fontSize="lg" color="gray.700" lineHeight="tall">
              At Sushi Shop, our mission is to provide an exceptional dining experience through 
              the art of traditional Japanese cuisine, while embracing innovation. We are committed to 
              using only the freshest ingredients, employing skilled chefs, and maintaining the 
              highest standards of food quality and service.
            </Text>
            <Text fontSize="lg" color="gray.700" lineHeight="tall" mt={4}>
              We believe that food brings people together, and our goal is to create a warm, 
              inviting space where friends and family can gather to enjoy delicious meals and 
              create lasting memories.
            </Text>
          </Box>
          <Box flex={1} borderRadius="md" overflow="hidden">
            <Image 
              src="https://source.unsplash.com/random/600x400/?sushi-chef" 
              alt="Sushi chef preparing food" 
              width="100%" 
              height="auto" 
            />
          </Box>
        </Flex>
        
        {/* Our Values */}
        <Box bg="gray.50" p={8} borderRadius="lg">
          <Heading as="h2" size="xl" textAlign="center" mb={10}>
            Our Values
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
            <GridItem textAlign="center">
              <Box bg="white" p={6} borderRadius="md" boxShadow="md" height="100%">
                <Heading as="h3" size="md" mb={4} color="primary.500">
                  Quality
                </Heading>
                <Text>
                  We never compromise on the quality of our ingredients. 
                  From the freshest fish to perfectly seasoned rice, every 
                  component meets our exacting standards.
                </Text>
              </Box>
            </GridItem>
            <GridItem textAlign="center">
              <Box bg="white" p={6} borderRadius="md" boxShadow="md" height="100%">
                <Heading as="h3" size="md" mb={4} color="primary.500">
                  Authenticity
                </Heading>
                <Text>
                  We honor traditional Japanese culinary techniques while 
                  bringing our own creative twist to classic recipes, 
                  ensuring an authentic yet innovative dining experience.
                </Text>
              </Box>
            </GridItem>
            <GridItem textAlign="center">
              <Box bg="white" p={6} borderRadius="md" boxShadow="md" height="100%">
                <Heading as="h3" size="md" mb={4} color="primary.500">
                  Community
                </Heading>
                <Text>
                  We are committed to supporting our local community through 
                  sustainable practices, partnerships with local suppliers, 
                  and giving back through various charitable initiatives.
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Team Section */}
        <Box>
          <Heading as="h2" size="xl" textAlign="center" mb={10}>
            Meet Our Team
          </Heading>
          <Text fontSize="lg" color="gray.700" textAlign="center" mb={10}>
            Our team of passionate culinary experts brings together decades of 
            experience and a shared love of Japanese cuisine.
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={8}>
            {/* Chef cards would go here */}
            <GridItem>
              <Box textAlign="center">
                <Image 
                  src="https://source.unsplash.com/random/300x300/?chef" 
                  alt="Head Chef" 
                  borderRadius="full" 
                  boxSize="200px" 
                  objectFit="cover" 
                  mx="auto" 
                  mb={4} 
                />
                <Heading as="h3" size="md">
                  Chef Hiroshi
                </Heading>
                <Text color="gray.500">Executive Chef</Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box textAlign="center">
                <Image 
                  src="https://source.unsplash.com/random/300x300/?woman-chef" 
                  alt="Sous Chef" 
                  borderRadius="full" 
                  boxSize="200px" 
                  objectFit="cover" 
                  mx="auto" 
                  mb={4} 
                />
                <Heading as="h3" size="md">
                  Chef Akiko
                </Heading>
                <Text color="gray.500">Sous Chef</Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box textAlign="center">
                <Image 
                  src="https://source.unsplash.com/random/300x300/?man-chef" 
                  alt="Pastry Chef" 
                  borderRadius="full" 
                  boxSize="200px" 
                  objectFit="cover" 
                  mx="auto" 
                  mb={4} 
                />
                <Heading as="h3" size="md">
                  Chef Takashi
                </Heading>
                <Text color="gray.500">Sushi Master</Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box textAlign="center">
                <Image 
                  src="https://source.unsplash.com/random/300x300/?kitchen-staff" 
                  alt="Manager" 
                  borderRadius="full" 
                  boxSize="200px" 
                  objectFit="cover" 
                  mx="auto" 
                  mb={4} 
                />
                <Heading as="h3" size="md">
                  Yuki Tanaka
                </Heading>
                <Text color="gray.500">Restaurant Manager</Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage;
