import React from 'react';
import {
  Box,
  VStack,
  Text,
  Link,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaSearch, FaList, FaCog } from 'react-icons/fa';
import ColorModeToggle from './ColorModeToggle';

const Sidebar: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('brand.100', 'brand.900');
  const activeBg = useColorModeValue('brand.200', 'brand.800');
  const location = useLocation();

  const navItems = [
    { path: '/ip-lookup', label: 'IP Lookup', icon: FaSearch },
  ];

  return (
    <Box
      w="250px"
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
    >
      <HStack justify="space-between" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Geolize
        </Text>
        <ColorModeToggle />
      </HStack>
      <VStack spacing={4} align="stretch">
        {navItems.map((item) => (
          <Link
            as={RouterLink}
            to={item.path}
            key={item.path}
            display="flex"
            alignItems="center"
            p={2}
            borderRadius="md"
            bg={location.pathname === item.path ? activeBg : 'transparent'}
            _hover={{ bg: hoverBg }}
          >
            <Icon as={item.icon as any} boxSize={5} mr={3} />
            <Text>{item.label}</Text>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 