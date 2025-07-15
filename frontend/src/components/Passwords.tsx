import { useState, useEffect, useMemo } from 'react';
import {
  Heading,
  Input,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Switch,
  Box,
} from '@chakra-ui/react';
import { MdAdd, MdRefresh, MdEdit, MdSave, MdClose, MdRemove, MdContentCopy } from 'react-icons/md';
import { createColumnHelper } from '@tanstack/react-table';
import { host } from '../connection';
import TanStackTable from './TanStackTable';
import AddPassword from './AddPassword';
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
  const [addingPassword, setAddingPassword] = useState(false);
  const [limit, setLimit] = useState(5);
  const [editId, setEditId] = useState<number | null>(null);
  const [editedEntry, setEditedEntry] = useState<PasswordEntry | null>(null);

  const bgColor = useColorModeValue('transparent', 'transparent');
  const textColor = useColorModeValue('black', 'white');
  const inputBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (status !== '') {
      setTimeout(() => setStatus(''), 4000);
    }
  }, [status]);

  const deletePassword = async (id: number) => {
    try {
      const response = await fetch(host + '/del_password', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const resData = await response.json();
      fetchPasswords();
      setStatus(resData.message);
    } catch (error) {
      setStatus('Error deleting password: ' + error);
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
      const response = await fetch(host + `/get_password?query=${encodeURIComponent(query)}&limit=${limit}`, {
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

  useEffect(() => {
    fetchPasswords();
  }, [query, limit]);

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
                mr={2}
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
              />
            </>
          ) : (
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
          )}
          <IconButton
            aria-label="Delete"
            icon={<MdRemove />}
            onClick={() => deletePassword(row.original.id)}
            colorScheme="red"
          />
        </Flex>
      ),
    }),
  ], [editId, editedEntry]);

  return (
    <Flex direction="column" align="center" height="100vh" width="100%" p={4} bg={bgColor} color={textColor}>
      {/* UI layout same as before */}
      {/* Table rendering same as before */}
      <Flex justify="space-between" width="100%" maxWidth="800px" alignItems="center" mb={4}>
        <Heading color={textColor}>Passwords</Heading>
        <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
      </Flex>
      <Flex mb={4} width="100%" maxWidth="800px" alignItems="center">
        <Input
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg={inputBgColor}
          color={textColor}
          mr={2}
        />
        <Input
          type="number"
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value) || 5)}
          bg={inputBgColor}
          color={textColor}
          mr={2}
          width="100px"
        />
        <IconButton
          aria-label="Refresh the passwords list"
          icon={<MdRefresh />}
          onClick={() => fetchPasswords()}
          colorScheme={colorMode === 'dark' ? 'teal' : 'blue'}
        />
      </Flex>
      {status && <Box mb={4} bg={useColorModeValue('gray.100', 'gray.800')} color={textColor} p={2}>{status}</Box>}
      <TanStackTable columns={columns} data={entries} />
    </Flex>
  );
};

export default Passwords;

