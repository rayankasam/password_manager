import { useState, useEffect } from 'react';
import PasswordCell from './passwordCell';
import { Heading, Input, Alert, IconButton, useColorMode, Flex, Switch, useColorModeValue } from '@chakra-ui/react';
import AddPassword from './AddPassword'
import { MdAdd, MdRefresh } from "react-icons/md";
import { host } from '../connection';

interface PasswordsProps {
  token: string;
}
interface PasswordEntry {
  id: number;
  platform: string;
  user: string;
  password: string;
}

const Passwords = ({ token }: PasswordsProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [addingPassword, setAddingPassword] = useState(false);

  const bgColor = useColorModeValue("transparent", "transparent");
  const textColor = useColorModeValue("black", "white");
  const inputBgColor = useColorModeValue("white", "gray.700");
  const alertBgColor = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    if (status !== '') {
      setTimeout(() => setStatus(''), 4000);
    }
  }, [status]);

  const deletePassword = async (id: number) => {
    if (isNaN(id)) {
      setStatus("Invalid entry, must be an id (int)");
    }
    console.log(id);
    try {
      console.log(`Making request to /del_password`);
      const response = await fetch(host + '/del_password', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id }),
      });
      const resData = await response.json();
      fetchPasswords();
      console.log(resData.message + "This one");
      setStatus(resData.message);
    } catch (error) {
      setStatus('Error deleting password:' + error);
    }
  };

  const updateEntryFunc = async (id: number, jsonString: string) => {
    try {
      const response = await fetch(host + '/update_password/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: jsonString
      });
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus('Error updating entry: ' + error);
    }
    setTimeout(() => fetchPasswords(), 200);
  }

  const fetchPasswords = async () => {
    try {
      const response = await fetch(host + `/get_password?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      setStatus('Error fetching passwords: ' + error);
    }
    console.log(token);
  };

  useEffect(() => {
    fetchPasswords();
  }, [query]);

  return (
    <Flex direction="column" align="center" height="100vh" width="50vw" p={4} bg={bgColor} color={textColor}>
      <Flex justify="space-between" width="100%" maxWidth="600px" alignItems="center" mb={4}>
        <Heading color={textColor}>Passwords</Heading>
        <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
      </Flex>
      <Flex mb={4} width="100%" maxWidth="600px" alignItems="center">
        <Input
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg={inputBgColor}
          color={textColor}
          mr={2}
        />
        <IconButton
          aria-label="Refresh the passwords list"
          icon={<MdRefresh />}
          onClick={() => fetchPasswords()}
          colorScheme={colorMode === "dark" ? "teal" : "blue"}
        />
      </Flex>
      {status && <Alert status="error" mb={4} bg={alertBgColor} color={textColor}>{status}</Alert>}
      <ul style={{ width: "100%", listStyleType: "none", padding: 0 }}>
        <PasswordCell
          key={-1}
          id={-1}
          password="Password"
          platform="Platform"
          username="Username"
          isTop={true}
        />
        {entries.length > 0 && entries.map((entry) => (
          <PasswordCell
            key={entry.id}
            id={entry.id}
            password={entry.password}
            platform={entry.platform}
            username={entry.user}
            deleteFunc={deletePassword}
            updateFunc={updateEntryFunc}
          />
        ))}
      </ul>
      {addingPassword ? (
        <AddPassword token={token} setAddingPassword={setAddingPassword} setStatus={setStatus} />
      ) : (
        <IconButton
          colorScheme='blue'
          aria-label='Add a new password'
          icon={<MdAdd />}
          onClick={() => setAddingPassword(true)}
          mt={4}
        />
      )}
    </Flex>
  );
};

export default Passwords;
