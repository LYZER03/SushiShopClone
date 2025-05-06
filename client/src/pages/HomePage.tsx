import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Container } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { SimpleGrid } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { InputGroup } from '@chakra-ui/input';
import { InputRightElement } from '@chakra-ui/input';
import { IconButton } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { Link } from 'react-router-dom';

/**
 * Home page component
 * Rubik's × Sushi Shop theme with cube visuals and striking design
 */
const HomePage = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? '#2a215a' : '#1a1442';
  const textColor = 'white';
  
  return (
    <Box as="section">
      {/* Hero Section - Rubik's Cube Theme */}
      <Box
        bgColor={bgColor}
        color={textColor}
        overflow="hidden"
        position="relative"
        minH={{ base: "90vh", md: "85vh" }}
        width="100vw"
        maxWidth="100vw"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
      >
        {/* Background grid patterns - mimicking cube patterns */}
        <Box 
          position="absolute" 
          top="0" 
          right="0" 
          height="40%" 
          width="40%" 
          opacity="0.1"
          bgImage="url('/images/rubiks-pattern.png')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="top right"
        />
        
        <Box 
          position="absolute" 
          bottom="0" 
          left="0" 
          height="50%" 
          width="40%" 
          opacity="0.1"
          bgImage="url('/images/grid-pattern.png')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="bottom left"
        />
        
        {/* Decorative Elements */}
        <Box 
          position="absolute" 
          top="5%" 
          right="5%" 
          w="150px" 
          h="150px"
          bg="#ffde00"
          opacity="0.2"
          borderRadius="lg"
          transform="rotate(15deg)"
          display={{ base: 'none', lg: 'block' }}
        />
        
        <Box 
          position="absolute" 
          bottom="15%" 
          right="15%" 
          w="100px" 
          h="100px"
          bg="#ff2f00"
          opacity="0.2"
          borderRadius="lg"
          transform="rotate(-20deg)"
          display={{ base: 'none', lg: 'block' }}
        />
        
        <Box 
          position="absolute" 
          top="40%" 
          right="25%" 
          w="80px" 
          h="80px"
          bg="#009fd9"
          opacity="0.2"
          borderRadius="lg"
          transform="rotate(45deg)"
          display={{ base: 'none', lg: 'block' }}
        />
        
        <Container maxW="container.xl" position="relative" py={{ base: 16, md: 20 }}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            h="full"
            position="relative"
            zIndex="2"
          >
            {/* Left side - Branding and CTA */}
            <Box 
              maxW={{ base: "100%", lg: "45%" }}
              mb={{ base: 12, lg: 0 }}
              textAlign={{ base: "center", lg: "left" }}
            >
              {/* Brand Logo */}
              <Flex 
                justify={{ base: "center", lg: "flex-start" }}
                align="center"
                mb={10}
              >
                <Image 
                  src="/images/rubiks-logo.png" 
                  alt="Rubik's Logo"
                  height="50px"
                  fallbackSrc="https://via.placeholder.com/200x50?text=RUBIK'S"
                  mr={4}
                />
                <Box fontSize="4xl" fontWeight="bold">×</Box>
                <Image 
                  src="/images/sushi-logo.png" 
                  alt="Sushi Shop Logo"
                  height="50px"
                  fallbackSrc="https://via.placeholder.com/200x50?text=SUSHISHOP"
                  ml={4}
                />
              </Flex>
              
              {/* Headline */}
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.2"
                mb={6}
              >
                Plongez dans un univers coloré et varié
              </Heading>
              
              {/* Address search form */}
              <Box maxW={{ base: "full", md: "400px" }} mx={{ base: "auto", lg: 0 }} mb={8}>
                <InputGroup size="lg">
                  <Input 
                    placeholder="Saisissez une adresse de livraison"
                    bg="rgba(255,255,255,0.1)"
                    border="none"
                    color="white"
                    _placeholder={{ color: "rgba(255,255,255,0.7)" }}
                    py={6}
                    borderRadius="full"
                  />
                  <InputRightElement width="4.5rem" height="full">
                    <IconButton
                      h="full"
                      size="lg"
                      borderRadius="full"
                      colorScheme="primary"
                      aria-label="Search location"
                      icon={<Box as="span">➤</Box>}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
              
              {/* CTA Button */}
              <Button
                as={Link}
                to="/menu"
                size="lg"
                borderRadius="full"
                bg="#ffde00" // Yellow color matching Rubik's cube
                color="#000"
                fontWeight="bold"
                px={8}
                py={6}
                _hover={{ bg: "#e6c700" }}
              >
                Je fonce
              </Button>
            </Box>
            
            {/* Right side - Sushi Cube Image with 3D-like arrangement */}
            <Flex 
              maxW={{ base: "90%", lg: "50%" }}
              position="relative"
              justify="center"
              align="center"
            >
              {/* Main Sushi Cube */}
              <Box position="relative" zIndex="3">
                <Image
                  src="/images/sushi-cube.png"
                  alt="Sushi presented in a Rubik's cube format"
                  fallbackSrc="https://via.placeholder.com/600x600?text=SUSHI+CUBE"
                  w="full"
                  maxW="500px"
                  borderRadius="md"
                  shadow="xl"
                />
                
                {/* Floating mini cube elements */}
                <Box
                  position="absolute"
                  top="-50px"
                  right="-30px"
                  width="100px"
                  height="100px"
                  bg="#ffde00"
                  borderRadius="lg"
                  transform="rotate(15deg)"
                  shadow="md"
                  opacity="0.9"
                  display={{ base: 'none', md: 'block' }}
                  overflow="hidden"
                >
                  <Image
                    src="/images/cube-salmon.jpg"
                    alt="Salmon sushi cube"
                    fallbackSrc="https://via.placeholder.com/100?text=SALMON"
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                </Box>
                
                <Box
                  position="absolute"
                  bottom="-30px"
                  left="-40px"
                  width="120px"
                  height="120px"
                  bg="#ff2f00"
                  borderRadius="lg"
                  transform="rotate(-10deg)"
                  shadow="md"
                  opacity="0.9"
                  display={{ base: 'none', md: 'block' }}
                  overflow="hidden"
                >
                  <Image
                    src="/images/cube-avocado.jpg"
                    alt="Avocado sushi cube"
                    fallbackSrc="https://via.placeholder.com/120?text=AVOCADO"
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                </Box>
                
                <Box
                  position="absolute"
                  top="30%"
                  right="-80px"
                  width="140px"
                  height="140px"
                  bg="#009fd9"
                  borderRadius="lg"
                  transform="rotate(5deg)"
                  shadow="md"
                  opacity="0.9"
                  display={{ base: 'none', md: 'block' }}
                  overflow="hidden"
                >
                  <Image
                    src="/images/cube-maki.jpg"
                    alt="Maki sushi cube"
                    fallbackSrc="https://via.placeholder.com/140?text=MAKI"
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                </Box>
                
                {/* Animated circles */}
                <Box
                  position="absolute"
                  top="-20px"
                  left="-60px"
                  width="40px"
                  height="40px"
                  borderRadius="full"
                  bg="rgba(255, 222, 0, 0.6)"
                  animation="float 6s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                    },
                  }}
                  display={{ base: 'none', md: 'block' }}
                />
                
                <Box
                  position="absolute"
                  bottom="40px"
                  right="-40px"
                  width="30px"
                  height="30px"
                  borderRadius="full"
                  bg="rgba(255, 47, 0, 0.6)"
                  animation="float 4s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                    },
                  }}
                  display={{ base: 'none', md: 'block' }}
                />
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Geometric separator */}
      <Box
        position="relative"
        height="100px"
        overflow="hidden"
        bg="white"
        width="100vw"
        maxWidth="100vw"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="100px"
          bg={bgColor}
          clipPath="polygon(0 0, 100% 0, 100% 30%, 0 100%)"
        />
        
        {/* Decorative cube elements */}
        <Box
          position="absolute"
          top="20px"
          left="10%"
          w="30px"
          h="30px"
          bg="#ffde00"
          borderRadius="sm"
          transform="rotate(25deg)"
        />
        
        <Box
          position="absolute"
          top="30px"
          left="25%"
          w="20px"
          h="20px"
          bg="#ff2f00"
          borderRadius="sm"
          transform="rotate(10deg)"
        />
        
        <Box
          position="absolute"
          top="15px"
          right="15%"
          w="25px"
          h="25px"
          bg="#009fd9"
          borderRadius="sm"
          transform="rotate(-15deg)"
        />
      </Box>

      {/* Featured Products Section - Cube Grid Layout */}
      <Box 
        as="section" 
        py={16} 
        bg="white"
        width="100vw"
        maxWidth="100vw"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
      >
        <Container maxW="container.xl">
          <VStack spacing={4} mb={12} textAlign="center">
            <Text color="#2a215a" fontSize="lg" fontWeight="medium">
              TOUT LE STOCK
            </Text>
            <Heading as="h2" size="xl" color="#2a215a">
              Nos Best-sellers
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
            {[
              {
                title: 'Maki Mix',
                image: '/images/sushi-box-1.jpg',
                price: '16,90 €',
                tag: 'SUR LE POUCE',
              },
              {
                title: 'Sushi Box',
                image: '/images/sushi-box-2.jpg',
                price: '19,90 €',
                tag: 'SUR LE STOCK',
              },
              {
                title: 'Cube Mix',
                image: '/images/sushi-box-3.jpg',
                price: '24,90 €',
                tag: 'SUR LE STOCK',
              },
            ].map((product, index) => (
              <Box
                key={index}
                bg="white"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl',
                }}
                position="relative"
              >
                <Box position="absolute" top={4} left={4} zIndex={2}>
                  <Box
                    bg="#ffde00"
                    color="black"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {product.tag}
                  </Box>
                </Box>
                
                <Box h="300px" overflow="hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallbackSrc={`https://via.placeholder.com/600x600?text=${product.title}`}
                  />
                </Box>
                
                <Flex p={5} justify="space-between" align="center">
                  <Box>
                    <Heading as="h3" size="md">
                      {product.title}
                    </Heading>
                    <Text fontWeight="bold" fontSize="lg" mt={1}>
                      {product.price}
                    </Text>
                  </Box>
                  
                  <Button
                    as={Link}
                    to={`/menu?product=${product.title.toLowerCase().replace(' ', '-')}`}
                    colorScheme="primary"
                    size="md"
                    borderRadius="full"
                    px={5}
                  >
                    Commander
                  </Button>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
          
          <Box textAlign="center" mt={12}>
            <Button
              as={Link}
              to="/menu"
              size="lg"
              borderRadius="full"
              bg="#2a215a"
              color="white"
              px={8}
              py={6}
              _hover={{ bg: '#1a1442' }}
            >
              Voir toute la carte
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Rubik's Experience Section */}
      <Box
        as="section"
        py={16}
        bg="#2a215a"
        color="white"
        position="relative"
        overflow="hidden"
        width="100vw"
        maxWidth="100vw"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
      >
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="300px"
          h="300px"
          opacity="0.15"
          bg="linear-gradient(45deg, #ffde00, #ff2f00, #ffffff)"
          borderRadius="full"
          filter="blur(60px)"
        />
        
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={10}
          >
            <Box flex={1} textAlign={{ base: "center", lg: "left" }}>
              <Heading size="xl" mb={6} lineHeight="1.2">
                Une expérience culinaire inspirée du Rubik's cube
              </Heading>
              <Text fontSize="lg" mb={8} maxW="600px" mx={{ base: "auto", lg: 0 }} opacity="0.9">
                Découvrez nos créations exclusives où saveurs et couleurs se mêlent pour créer une expérience sensorielle unique. Chaque box est un puzzle gastronomique à résoudre avec vos papilles.
              </Text>
              <Button
                as={Link}
                to="/about"
                borderRadius="full"
                bg="transparent"
                border="2px solid white"
                color="white"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                size="lg"
                px={8}
              >
                Découvrir notre concept
              </Button>
            </Box>
            
            <Flex flex={1} justify="center">
              <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4}>
                <Image
                  src="/images/cube-frame-1.jpg"
                  alt="Sushi Experience"
                  borderRadius="md"
                  boxSize="200px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/200x200?text=Sushi"
                />
                <Image
                  src="/images/cube-frame-2.jpg"
                  alt="Sushi Experience"
                  borderRadius="md"
                  boxSize="200px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/200x200?text=Sushi"
                />
              </SimpleGrid>
            </Flex>
          </Flex>
        </Container>
      </Box>
      
      {/* Social Media Section */}
      <Box 
        as="section" 
        py={16} 
        bg="#f5f5f5"
        width="100vw"
        maxWidth="100vw"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
      >
        <Container maxW="container.xl">
          <VStack spacing={4} mb={10} textAlign="center">
            <Heading as="h2" size="lg" color="#2a215a">
              #RUBIKSSUSHISHOP
            </Heading>
            <Text fontSize="md" color="gray.600" maxW="2xl">
              Partagez votre expérience sur Instagram
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={4}>
            {Array(5).fill(0).map((_, i) => (
              <Box 
                key={i} 
                bg="white" 
                borderRadius="md" 
                overflow="hidden"
                boxShadow="sm"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.03)' }}
              >
                <Image
                  src={`/images/social-${i + 1}.jpg`}
                  alt={`Social media post ${i + 1}`}
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallbackSrc={`https://via.placeholder.com/400x400?text=Instagram+${i + 1}`}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
