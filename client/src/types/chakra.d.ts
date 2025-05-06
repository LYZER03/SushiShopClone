// This file provides module declarations to help resolve TypeScript issues
// during implementation of Step 9

declare module '@chakra-ui/react' {
  import * as React from 'react';
  
  // ChakraProvider component
  export const ChakraProvider: React.FC<{
    theme?: any;
    children: React.ReactNode;
  }>;
  
  // UI Components
  export const Box: React.FC<any>;
  export const Button: React.FC<any>;
  export const Container: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Heading: React.FC<any>;
  export const SimpleGrid: React.FC<any>;
  export const Text: React.FC<any>;
  export const VStack: React.FC<any>;
  
  // Hooks
  export const useToast: () => any;
  export const useColorMode: () => {
    colorMode: string;
    toggleColorMode: () => void;
  };
  
  // Theme
  export const extendTheme: (theme: any) => any;
  export type ThemeConfig = any;
}
