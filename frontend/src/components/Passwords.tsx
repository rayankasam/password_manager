import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Heading,
  Input,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Switch,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAdd, MdRefresh, MdEdit, MdSave, MdClose, MdRemove, MdContentCopy } from 'react-icons/md';
import { createColumnHelper } from '@tanstack/react-table';
import { host } from '../connection';
import TanStackTable from './TanStackTable';
import EditableCell from './EditableCell';

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
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editedEntry, setEditedEntry] = useState<PasswordEntry | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<PasswordEntry, 'id'>>({ 
    platform: '', 
    user: '', 
    password: '' 
  });
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const [passwordToDelete, setPasswordToDelete] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue('transparent', 'transparent');
  const textColor = useColorModeValue('black', 'white');
  const inputBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (status !== '') {
      setTimeout(() => setStatus(''), 4000);
    }
  }, [status]);

  const handleDeleteClick = (id: number) => {
  setPasswordToDelete(id);
  onDeleteDialogOpen();
};

const deletePassword = async () => {
  if (passwordToDelete === null) return;
  
  try {
    const response = await fetch(host + '/del_password', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: passwordToDelete }),
    });
    const resData = await response.json();
    fetchPasswords();
    setStatus(resData.message);
    onDeleteDialogClose();
    setPasswordToDelete(null);
  } catch (error) {
    setStatus('Error deleting password: ' + error);
    onDeleteDialogClose();
    setPasswordToDelete(null);
  }
};

  const updateEntryFunc = async (updatedEntry: PasswordEntry) => {
    try {
      const response = await fetch(host + '/update_password/' + updatedEntry.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEntry),
      });
      const data = await response.json();
      setStatus(data.message);
      setEditId(null);
      setEditedEntry(null);
      fetchPasswords();
    } catch (error) {
      setStatus('Error updating entry: ' + error);
    }
  };

  const fetchPasswords = async () => {
    try {
      const response = await fetch(host + `/get_password?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      setStatus('Error fetching passwords: ' + error);
    }
  };

    const createPassword = async () => {
	    try {
	      const response = await fetch(host + '/add_password', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify(newEntry),
	      });
	      const data = await response.json();
	      setStatus(data.message);
	      setIsAdding(false);
	      setNewEntry({ platform: '', user: '', password: '' });
	      fetchPasswords();
	    } catch (error) {
	      setStatus('Error creating password: ' + error);
	    }
	  };

  useEffect(() => {
    fetchPasswords();
  }, [query]);

  const columnHelper = createColumnHelper<PasswordEntry>();

  const columns = useMemo(() => [
    columnHelper.accessor('platform', {
      header: 'Platform',
      cell: ({ row }) =>
        editId === row.original.id && editedEntry ? (
          <EditableCell
            value={editedEntry.platform}
            onChange={(newValue) => setEditedEntry({ ...editedEntry, platform: newValue })}
          />
        ) : (
          row.original.platform
        ),
    }),
    columnHelper.accessor('user', {
      header: 'Username',
      cell: ({ row }) => (
        <Flex align="center">
          {editId === row.original.id && editedEntry ? (
            <EditableCell
              value={editedEntry.user}
              onChange={(newValue) => setEditedEntry({ ...editedEntry, user: newValue })}
            />
          ) : (
            row.original.user
          )}
          <IconButton
            aria-label="Copy Username"
            icon={<MdContentCopy />}
            onClick={() => navigator.clipboard.writeText(row.original.user)}
            colorScheme="gray"
            size="sm"
            ml={2}
          />
        </Flex>
      ),
    }),
    columnHelper.accessor('password', {
      header: 'Password',
      cell: ({ row }) => (
        <Flex align="center">
          {editId === row.original.id && editedEntry ? (
            <EditableCell
              value={editedEntry.password}
              onChange={(newValue) => setEditedEntry({ ...editedEntry, password: newValue })}
            />
          ) : (
            '••••••••'
          )}
          <IconButton
            aria-label="Copy Password"
            icon={<MdContentCopy />}
            onClick={() => navigator.clipboard.writeText(row.original.password)}
            colorScheme="gray"
            size="sm"
            ml={2}
          />
        </Flex>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <Flex>
          {editId === row.original.id ? (
            <>
              <IconButton
                aria-label="Save"
                icon={<MdSave />}
                onClick={() => {
                  if (editedEntry) updateEntryFunc(editedEntry);
                }}
                colorScheme="green"
                mr={"5px"}
              />
              <IconButton
                aria-label="Cancel"
                icon={<MdClose />}
                onClick={() => {
                  setEditId(null);
                  setEditedEntry(null);
                  fetchPasswords();
                }}
                colorScheme="red"
		mr="5px"
              />
            </>
          ) : (
	  <>
            <IconButton
              aria-label="Edit"
              icon={<MdEdit />}
              onClick={() => {
                setEditId(row.original.id);
                setEditedEntry({ ...row.original });
              }}
              colorScheme="blue"
              mr={2}
            />
          <IconButton
            aria-label="Delete"
            icon={<MdRemove />}
            onClick={() => handleDeleteClick(row.original.id)}
            colorScheme="red"
          />
	    </>
          )}
        </Flex>
      ),
    }),
  ], [editId, editedEntry]);

  return (
    <Flex 
      direction="column" 
      align="center" 
      height="100vh" 
      maxHeight="100vh"
      width="100%" 
      maxWidth="100vw" 
      p={4} 
      bg={bgColor} 
      color={textColor}
    >
      <Flex 
        justify="space-between" 
        width="100%" 
        maxWidth="800px" 
        alignItems="center" 
        mb={4}
      >
        <Heading color={textColor}>Passwords</Heading>
        <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      </Flex>
       {isAdding && (
        <Flex 
          mb={4} 
          width="100%" 
          maxWidth="800px" 
          alignItems="center"
          bg={inputBgColor}
          p={4}
          borderRadius="md"
        >
          <Input
            placeholder="Platform"
            value={newEntry.platform}
            onChange={(e) => setNewEntry({...newEntry, platform: e.target.value})}
            bg={useColorModeValue('white', 'gray.800')}
            mr={2}
          />
          <Input
            placeholder="Username"
            value={newEntry.user}
            onChange={(e) => setNewEntry({...newEntry, user: e.target.value})}
            bg={useColorModeValue('white', 'gray.800')}
            mr={2}
          />
          <Input
            placeholder="Password"
            value={newEntry.password}
            onChange={(e) => setNewEntry({...newEntry, password: e.target.value})}
            bg={useColorModeValue('white', 'gray.800')}
            mr={2}
          />
          <IconButton
            aria-label="Save new password"
            icon={<MdSave />}
            onClick={createPassword}
            colorScheme="green"
            mr={2}
          />
          <IconButton
            aria-label="Cancel"
            icon={<MdClose />}
            onClick={() => {
              setIsAdding(false);
              setNewEntry({ platform: '', user: '', password: '' });
            }}
            colorScheme="red"
          />
        </Flex>
      )}
	{!isAdding &&
      <Flex 
        mb={4} 
        width="100%" 
        maxWidth="800px" 
        alignItems="center"
      >
        <Input
          type="text"
          placeholder="Search..."
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
          colorScheme={colorMode === 'dark' ? 'teal' : 'blue'}
	  mr={"5px"}
        />
	<IconButton
          aria-label="Add new password"
          icon={<MdAdd />}
          onClick={() => setIsAdding(true)}
          colorScheme="green"
        />
      </Flex>
	}
      {status && (
        <Box 
          mb={4} 
          bg={useColorModeValue('gray.100', 'gray.800')} 
          color={textColor} 
          p={2}
        >
          {status}
        </Box>
      )}
      <Box 
        width="100%" 
        maxWidth="100vw" 
        maxHeight="calc(100vh - 180px)" // Adjust based on header/input/status height
        overflowY="auto" // Enable vertical scrolling
        overflowX="auto" // Enable horizontal scrolling if needed
      >
        <TanStackTable columns={columns} data={entries} colorMode={colorMode}/>
      </Box>
      <AlertDialog
  isOpen={isDeleteDialogOpen}
  leastDestructiveRef={cancelRef}
  onClose={onDeleteDialogClose}
>
  <AlertDialogOverlay>
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        Delete Password
      </AlertDialogHeader>

      <AlertDialogBody>
        Are you sure you want to delete this password? This action cannot be undone.
      </AlertDialogBody>

      <AlertDialogFooter>
        <Button ref={cancelRef} onClick={onDeleteDialogClose}>
          Cancel
        </Button>
        <Button colorScheme="red" onClick={deletePassword} ml={3}>
          Delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogOverlay>
</AlertDialog>
    </Flex>
  );
};

export default Passwords;
