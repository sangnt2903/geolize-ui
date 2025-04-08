import React from 'react';
import { IconButton, useColorMode, Icon } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === 'dark' ? <Icon as={FaSun as any} /> : <Icon as={FaMoon as any} />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      fontSize="lg"
      colorScheme="brand"
    />
  );
};

export default ColorModeToggle; 