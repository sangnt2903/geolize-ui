import { extendTheme,  type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  colors: {
    gray: {
      900: '#1a202c',
      800: '#2d3748',
      700: '#4a5568',
      600: '#718096',
      500: '#a0aec0',
      400: '#cbd5e0',
      300: '#e2e8f0',
      200: '#edf2f7',
      100: '#f7fafc',
    },
    black: '#000000',
    brand: {
      primary: '#6B46C1',
      secondary: '#9F7AEA',
      accent: '#81E6D9',
    },
    status: {
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#F56565',
      info: '#4299E1',
    },
  },
  components: {
    Sidebar: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
        borderRight: '1px',
        borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
      }),
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: 'lg',
        boxShadow: 'lg',
        p: 6,
      }),
    },
    StatCard: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: 'lg',
        p: 4,
        transition: 'all 0.2s',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        },
      }),
    },
    Calendar: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: 'md',
        p: 4,
        '.calendar-day': {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          },
        },
        '.calendar-day-selected': {
          bg: 'brand.primary',
          color: 'white',
        },
      }),
    },
  },
});

export default theme;