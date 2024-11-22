import React, { useState } from 'react';
import { Input, Button, Heading, InputGroup, InputRightElement, IconButton, Box, useColorModeValue, VStack } from '@chakra-ui/react';
import { MdRemove } from "react-icons/md";
import { host } from '../connection';

interface AddPasswordProps {
  token: string,
  setAddingPassword: (value: boolean) => void,
  setStatus: (status: string) => void
}

const AddPassword = ({ token, setAddingPassword, setStatus }: AddPasswordProps) => {
  const [platform, setPlatform] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleClickShow = () => setShow(!show);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (platform === "") { setStatus("No platform"); return; }
    if (user === "") { setStatus("No username"); return; }
    if (password === "") { setStatus("No password"); return; }
    const body = JSON.stringify({
      platform,
      user,
      password,
    });
    console.log(body);
    const response = await fetch(host + '/add_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    const data = await response.json();
    setStatus(data.message);
    setAddingPassword(false);
  };

  const containerBgColor = useColorModeValue("white", "gray.700");
  const containerTextColor = useColorModeValue("black", "white");
  const inputBgColor = useColorModeValue("gray.100", "gray.600");

  return (
    <Box p={6} borderRadius="lg" boxShadow="lg" bg={containerBgColor} color={containerTextColor} maxWidth="400px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="md" textAlign="center">Add Password</Heading>
        <IconButton
          colorScheme={'red'}
          aria-label={"Don't add password"}
          icon={<MdRemove />}
          onClick={() => setAddingPassword(false)}
          alignSelf="center"
          mb={4}
        />
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4} align="stretch">
            <Input
              type="text"
              placeholder="Platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              bg={inputBgColor}
              color={containerTextColor}
            />
            <Input
              type="text"
              placeholder="User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              bg={inputBgColor}
              color={containerTextColor}
            />
            <InputGroup>
              <Input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={inputBgColor}
                color={containerTextColor}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClickShow} bg={containerBgColor} color={containerTextColor} _hover={{ bg: inputBgColor }}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button type="submit" colorScheme="blue" width="full">Add</Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default AddPassword;

const formStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
};
