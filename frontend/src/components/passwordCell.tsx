import { useState } from "react";
import Spoiler from "./spoilerTag";
import { Button, Input, useColorModeValue, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { MdEdit, MdDeleteOutline, MdCheck, MdOutlineContentCopy, MdContentCopy } from "react-icons/md";

interface PasswordCellProps {
  id: number;
  platform: string;
  username: string;
  password: string;
  updateFunc?: (id: number, jsonstring: string) => void;
  deleteFunc?: (id: number) => void;
  isTop?: boolean;
}

const PasswordCell = ({ id, platform, username, password, updateFunc, deleteFunc, isTop = false }: PasswordCellProps) => {
  const [editing, setEditing] = useState(false);
  const [platformEdit, setPlatformEdit] = useState(platform);
  const [usernameEdit, setUsernameEdit] = useState(username);
  const [passwordEdit, setPasswordEdit] = useState(password);

  const containerBgColor = useColorModeValue("white", "gray.700");
  const containerTextColor = useColorModeValue("black", "gray.100");
  const inputBgColor = useColorModeValue("white", "gray.600");

  const buttonWidth = useBreakpointValue({ base: '100%', lg: 'auto' });
  const copyToClipboard = (text: string) => {
	  console.log('text', text)
	  var textField = document.createElement('textarea')
	  textField.innerText = text
	  document.body.appendChild(textField)
	  textField.select()
	  document.execCommand('copy')
	  textField.remove()
  }

  const handleConfirmEdit = () => {
    const updatedEntry: { platform?: string; user?: string; password?: string } = {};
    if (platformEdit !== platform) {
      updatedEntry.platform = platformEdit;
      console.log("New platform is: " + platformEdit);
    }
    if (usernameEdit !== username) {
      updatedEntry.user = usernameEdit;
      console.log("New username is: " + usernameEdit);
    }
    if (passwordEdit !== password) {
      updatedEntry.password = passwordEdit;
      console.log("New password is: " + passwordEdit);
    }
    if (Object.keys(updatedEntry).length > 0 && updateFunc) {
      const jsonString = JSON.stringify(updatedEntry);
      updateFunc(id, jsonString);
      console.log("Update json is: " + jsonString);
    }
    setEditing(false);
  };

  return (
    <Box mb={4} width="100%" boxShadow="lg" borderRadius="md">
      {!editing ? (
        <Flex
          direction={{ base: "column", lg: "row" }}
          bg={containerBgColor}
          color={containerTextColor}
          p={4}
          borderRadius="10px"
          border="1px solid #ccc"
          align="center"
          justify="space-between"
        >
          <Box textAlign="left" flex="1" fontWeight="bold" mb={{ base: 2, lg: 0 }}>{platform}</Box>
          <Box textAlign="left" flex="1" mb={{ base: 2, lg: 0 }}>{username}
	  {!isTop && <Button leftIcon={<MdContentCopy/>} iconSpacing={"auto"} onClick={() => copyToClipboard(username)} ml={2}/>}
	  </Box>
          <Box textAlign="left" flex="1" mb={{ base: 2, lg: 0 }}>{isTop ? password : <Spoiler text={password} />} 
	  {!isTop && <Button leftIcon={<MdContentCopy/>} iconSpacing={"auto"} onClick={() => copyToClipboard(password)} ml={2}/>}
	  </Box>
          {!isTop && deleteFunc ? 
            <Flex direction={{ base: "column", lg: "row" }} ml={{ lg: 4 }} justifyContent="flex-end">
              <Button
                leftIcon={<MdDeleteOutline />}
                colorScheme="red"
                onClick={() => deleteFunc(id)}
                mb={{ base: 2, lg: 0 }}
                width={buttonWidth}
                mr={{ base: 0, lg: 2 }}
                size="sm"
              >
                Delete
              </Button>
              <Button
                leftIcon={<MdEdit />}
                colorScheme="blue"
                onClick={() => setEditing(true)}
                width={buttonWidth}
                size="sm"
              >
                Edit
              </Button>
            </Flex>
	    :
          <Box textAlign="left" flex="1" mb={{ base: 2, lg: 0 }}></Box>
          }
        </Flex>
      ) : (
        <Flex direction="column" bg={containerBgColor} color={containerTextColor} p={4} borderRadius="10px" border="1px solid #ccc" align="flex-start" justify="space-between">
          <Input
            placeholder={platform}
            onChange={(e) => setPlatformEdit(e.target.value)}
            value={platformEdit}
            bg={inputBgColor}
            color={containerTextColor}
            mb={2}
            size="sm"
          />
          <Input
            placeholder={username}
            onChange={(e) => setUsernameEdit(e.target.value)}
            value={usernameEdit}
            bg={inputBgColor}
            color={containerTextColor}
            mb={2}
            size="sm"
          />
          <Input
            placeholder={password}
            onChange={(e) => setPasswordEdit(e.target.value)}
            value={passwordEdit}
            bg={inputBgColor}
            color={containerTextColor}
            mb={2}
            size="sm"
          />
          {!isTop ?
            <Button
              leftIcon={<MdCheck />}
              colorScheme="green"
              onClick={handleConfirmEdit}
              mt={2}
              width="100%"
              size="sm"
            >
              Confirm
            </Button>
          : 
		  <p>Hello</p>
	  }
        </Flex>
      )}
    </Box>
  );
};

export default PasswordCell;
