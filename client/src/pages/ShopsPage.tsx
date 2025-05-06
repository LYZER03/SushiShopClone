import { Box } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { Button } from '@chakra-ui/button';
import { Link } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/color-mode';

/**
 * Shops page component displaying all physical shop locations
 */
const ShopsPage = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? '#2a215a' : '#1a1442';
  
  const shops = [
    {
      name: "Paris - Saint Lazare",
      address: "32 Rue de Londres, 75009 Paris",
      image: "/images/shop-paris.jpg",
      hours: "11h-23h, 7j/7"
    },
    {
      name: "Lyon - Bellecour",
      address: "15 Place Bellecour, 69002 Lyon",
      image: "/images/shop-lyon.jpg",
      hours: "11h-22h, 7j/7"
    },
    {
      name: "Marseille - Vieux Port",
      address: "42 Quai du Port, 13002 Marseille",
      image: "/images/shop-marseille.jpg",
      hours: "11h-23h, 7j/7"
    },
    {
      name: "Bordeaux - Quinconces",
      address: "18 Allées de Tourny, 33000 Bordeaux",
      image: "/images/shop-bordeaux.jpg",
      hours: "11h-22h, 7j/7"
    }
  ];

  return (
    <Box as="section">
      {/* Hero Section */}
      <Box
        bgColor={bgColor}
        color="white"
        py={16}
        mb={12}
      >
        <Container maxW="container.xl">
          <Heading 
            as="h1" 
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            mb={4}
            textAlign="center"
          >
            Nos Shops
          </Heading>
          <Text 
            fontSize="lg" 
            textAlign="center" 
            maxW="700px" 
            mx="auto"
            opacity={0.9}
          >
            Découvrez nos restaurants Rubik's × Sushi Shop dans toute la France. 
            Nos équipes vous accueillent tous les jours pour déguster sur place ou emporter.
          </Text>
        </Container>
      </Box>
      
      {/* Shops Grid */}
      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {shops.map((shop, index) => (
            <Box 
              key={index} 
              bg="white" 
              boxShadow="md" 
              borderRadius="lg" 
              overflow="hidden"
            >
              <Box h="200px" overflow="hidden">
                <Image
                  src={shop.image}
                  alt={`Boutique ${shop.name}`}
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallbackSrc={`https://via.placeholder.com/600x400?text=${shop.name}`}
                />
              </Box>
              <Box p={6}>
                <Heading as="h3" size="md" mb={2}>{shop.name}</Heading>
                <Text mb={1} fontWeight="medium">{shop.address}</Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Ouvert {shop.hours}
                </Text>
                <Button
                  as="a"
                  href={`https://maps.google.com/?q=${shop.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="primary"
                  size="sm"
                  mr={2}
                >
                  Itinéraire
                </Button>
                <Button
                  as={Link}
                  to="/menu"
                  variant="outline"
                  colorScheme="primary"
                  size="sm"
                >
                  Commander
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ShopsPage;
