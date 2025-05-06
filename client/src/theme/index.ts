import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
// Theme customization for Sushi Shop

// Define the color palette based on the design document
const colors = {
  primary: {
    50: '#ffe6ec',
    100: '#ffb8c8',
    200: '#ff8aa4',
    300: '#ff5c80',
    400: '#ff2e5c',
    500: '#E94560', // Primary color from design doc
    600: '#d43654',
    700: '#af2947',
    800: '#8a1b39',
    900: '#651029',
  },
  secondary: {
    50: '#e6edf7',
    100: '#c0d1e7',
    200: '#9ab5d8',
    300: '#7399c8',
    400: '#4d7db9',
    500: '#0F3460', // Secondary color from design doc
    600: '#0c2c57',
    700: '#08254e',
    800: '#051e45',
    900: '#02173c',
  },
  accent: {
    50: '#e6e8f0',
    100: '#c1c5d9',
    200: '#9ba2c2',
    300: '#757faa',
    400: '#505c93',
    500: '#16213E', // Accent color from design doc
    600: '#131d38',
    700: '#101932',
    800: '#0c152c',
    900: '#091226',
  },
  text: {
    primary: '#1A1A2E',
  },
  background: {
    primary: '#FFFFFF',
  },
};

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Typography configuration
const fonts = {
  heading: 'Poppins, sans-serif',
  body: 'Inter, sans-serif',
  accent: '"Noto Sans JP", sans-serif',
};

// Extend the theme
const theme = extendTheme({
  colors,
  config,
  fonts,
  styles: {
    global: {
      body: {
        bg: 'background.primary',
        color: 'text.primary',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
        },
        secondary: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
          },
        },
      },
    },
  },
});

export default theme;
