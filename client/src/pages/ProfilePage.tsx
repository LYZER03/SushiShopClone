import React from 'react';
import { Box, Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';

/**
 * ProfilePage component for user profile management
 */
const ProfilePage: React.FC = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">
          My Profile
        </Heading>
        
        <Box bg="white" borderRadius="md" boxShadow="md" overflow="hidden">
          <Tabs colorScheme="primary" isLazy>
            <TabList px={4} pt={4}>
              <Tab>Personal Info</Tab>
              <Tab>Order History</Tab>
              <Tab>Favorites</Tab>
              <Tab>Payment Methods</Tab>
              <Tab>Addresses</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Box p={4}>
                  <Heading as="h2" size="md" mb={4}>
                    Personal Information
                  </Heading>
                  <Text color="gray.600">
                    This section will contain user information form that can be edited.
                  </Text>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <Box p={4}>
                  <Heading as="h2" size="md" mb={4}>
                    Order History
                  </Heading>
                  <Text color="gray.600">
                    This section will display the user's past orders.
                  </Text>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <Box p={4}>
                  <Heading as="h2" size="md" mb={4}>
                    Favorite Items
                  </Heading>
                  <Text color="gray.600">
                    This section will display the user's favorite menu items.
                  </Text>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <Box p={4}>
                  <Heading as="h2" size="md" mb={4}>
                    Payment Methods
                  </Heading>
                  <Text color="gray.600">
                    This section will allow the user to manage their payment methods.
                  </Text>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <Box p={4}>
                  <Heading as="h2" size="md" mb={4}>
                    Delivery Addresses
                  </Heading>
                  <Text color="gray.600">
                    This section will allow the user to manage their delivery addresses.
                  </Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
