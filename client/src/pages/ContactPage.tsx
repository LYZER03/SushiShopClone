import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Heading, 
  Input, 
  Text, 
  Textarea, 
  Flex
} from '@chakra-ui/react';

// Custom components to replace unsupported Chakra UI v3 form elements
const FormControl: React.FC<{isRequired?: boolean; children: React.ReactNode}> = ({ isRequired, children }) => (
  <Box mb={4} position="relative">
    {isRequired && (
      <Box position="absolute" top="0" right="0" color="red.500">
        *
      </Box>
    )}
    {children}
  </Box>
);

const FormLabel: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <Text fontWeight="bold" mb={2}>
    {children}
  </Text>
);

/**
 * ContactPage component for customer inquiries and support
 */
const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction="column" gap={8} width="100%">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Contact Us
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
            We're here to help! Reach out to us with any questions, feedback, or support needs.
          </Text>
        </Box>
        
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10}>
          {/* Contact Form */}
          <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
            <Flex direction="column" gap={6} as="form" onSubmit={handleSubmit}>
              <Heading as="h2" size="lg">
                Send Us a Message
              </Heading>
              
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Your name" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Your email address" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input placeholder="Your phone number (optional)" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input placeholder="What is this regarding?" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="Please provide details about your inquiry..." minH="150px" />
              </FormControl>
              
              <Button colorScheme="primary" size="lg" width="full" type="submit">
                Submit
              </Button>
            </Flex>
          </Box>
          
          {/* Contact Information */}
          <Box>
            <Flex direction="column" gap={10}>
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  Contact Information
                </Heading>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold" mb={1}>Address</Text>
                    <Text>123 Sushi Lane</Text>
                    <Text>Tokyo District</Text>
                    <Text>Culinary City, 12345</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Phone</Text>
                    <Text>(555) 123-4567</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Email</Text>
                    <Text>info@sushishopclone.com</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Hours</Text>
                    <Text>Monday - Friday: 11:00 AM - 10:00 PM</Text>
                    <Text>Saturday - Sunday: 12:00 PM - 11:00 PM</Text>
                  </Box>
                </Flex>
              </Box>
              
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>
                  Frequently Asked Questions
                </Heading>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold">Do you offer delivery?</Text>
                    <Text>Yes, we offer delivery within a 5-mile radius of our location.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">What are your catering options?</Text>
                    <Text>We offer catering for events of all sizes. Please contact us for a custom quote.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">Do you accommodate dietary restrictions?</Text>
                    <Text>Absolutely! We offer vegetarian, vegan, and gluten-free options.</Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Grid>
        
        {/* Map section would go here */}
        <Box height="400px" bg="gray.100" borderRadius="lg" display="flex" justifyContent="center" alignItems="center">
          <Text fontSize="lg" color="gray.500">Map integration will be available here</Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default ContactPage;
