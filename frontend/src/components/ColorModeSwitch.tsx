import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ColorModeSwitchProps {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const ColorModeSwitch = ({ colorMode, toggleColorMode }: ColorModeSwitchProps) => {
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${colorMode} mode`}
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      _hover={{
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    />
  );
};

export default ColorModeSwitch;
