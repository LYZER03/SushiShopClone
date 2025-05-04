import React from 'react';
import { Box, Button, Container, FormControl, FormLabel, Grid, Heading, Input, Text, Textarea, VStack } from '@chakra-ui/react';

/**
 * ContactPage component for customer inquiries and support
 */
const ContactPage: React.FC = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
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
            <VStack spacing={6} as="form">
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
                <Textarea placeholder="Please provide details about your inquiry..." minHeight="150px" />
              </FormControl>
              
              <Button colorScheme="primary" size="lg" width="full">
                Submit
              </Button>
            </VStack>
          </Box>
          
          {/* Contact Information */}
          <Box>
            <VStack spacing={10} align="start">
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  Contact Information
                </Heading>
                <VStack spacing={4} align="start">
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
                </VStack>
              </Box>
              
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>
                  Frequently Asked Questions
                </Heading>
                <VStack spacing={4} align="start">
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
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Grid>
        
        {/* Map section would go here */}
        <Box height="400px" bg="gray.100" borderRadius="lg" display="flex" justifyContent="center" alignItems="center">
          <Text fontSize="lg" color="gray.500">Map integration will be available here</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactPage;
