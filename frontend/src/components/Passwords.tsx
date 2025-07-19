import { useState, useEffect, useRef } from "react";
import {
  Heading,
  Input,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Text,
  UseToastOptions,
  ToastId,
} from "@chakra-ui/react";

import {
  MdAdd,
  MdRefresh,
  MdEdit,
  MdSave,
  MdClose,
  MdRemove,
  MdContentCopy,
} from "react-icons/md";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Table as ReactTable,
  CellContext,
} from "@tanstack/react-table";

import ColorModeSwitch from "./ColorModeSwitch";
import { host } from "../connection";

interface PasswordEntry {
  id: number;
  platform: string;
  user: string;
  password: string;
}

interface PasswordResponse {
  items: PasswordEntry[];
  total: number;
  page: number;
  page_size: number;
}

interface PasswordsProps {
  token: string;
  toast: (options?: UseToastOptions) => ToastId;
}

interface ColumnMeta {
  type?: string;
}

type TableMeta = {
  editedRows: { [key: string]: boolean };
  setEditedRows: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  revertData: (rowIndex: number, revert: boolean) => void;
  updateData: (rowIndex: number, columnId: string, value: string) => void;
  saveRow: (updatedRow: PasswordEntry) => void;
};

const TableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<PasswordEntry, unknown>) => {
  const initialValue = getValue() as string;
  const columnId = column.id;
  const meta = table.options.meta as TableMeta;
  const isEditing = meta?.editedRows[row.id];
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    meta?.updateData(row.index, columnId, value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(initialValue);
  };

  if (isEditing) {
    const inputType = (column.columnDef.meta as ColumnMeta)?.type || "text";

    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        size="sm"
        type={inputType}
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      leftIcon={<MdContentCopy />}
      onClick={handleCopy}
    >
      {columnId === "password" ? "••••••••" : initialValue}
    </Button>
  );
};

const EditCell = ({
  row,
  table,
}: {
  row: any;
  table: ReactTable<PasswordEntry>;
}) => {
  const meta = table.options.meta as TableMeta;
  const isEditing = meta?.editedRows[row.id];

  const toggleEdit = (action: "edit" | "cancel" | "done") => {
    if (action === "cancel") {
      meta?.setEditedRows((prev) => ({ ...prev, [row.id]: false }));
      meta?.revertData(row.index, true);
    } else if (action === "done") {
      meta?.setEditedRows((prev) => ({ ...prev, [row.id]: false }));
      meta?.saveRow(row.original);
    } else {
      meta?.setEditedRows((prev) => ({ ...prev, [row.id]: true }));
      meta?.revertData(row.index, false);
    }
  };

  return (
    <Flex>
      {isEditing ? (
        <>
          <IconButton
            aria-label="Cancel"
            icon={<MdClose />}
            onClick={() => toggleEdit("cancel")}
            colorScheme="red"
            mr={1}
          />
          <IconButton
            aria-label="Save"
            icon={<MdSave />}
            onClick={() => toggleEdit("done")}
            colorScheme="green"
          />
        </>
      ) : (
        <IconButton
          aria-label="Edit"
          icon={<MdEdit />}
          onClick={() => toggleEdit("edit")}
          colorScheme="blue"
        />
      )}
    </Flex>
  );
};

const Passwords = ({ token, toast }: PasswordsProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [originalData, setOriginalData] = useState<PasswordEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<PasswordEntry, "id">>({
    platform: "",
    user: "",
    password: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [totalEntryCount, setTotalEntryCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwordToDelete, setPasswordToDelete] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue("transparent", "transparent");
  const textColor = useColorModeValue("black", "white");
  const inputBgColor = useColorModeValue("white", "gray.700");

  const fetchPasswords = async () => {
    try {
      const response = await fetch(
        `${host}/get_password?query=${encodeURIComponent(query)}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data: PasswordResponse = await response.json();
      setEntries(data.items);
      setOriginalData(data.items);
      setTotalEntryCount(data.total);
    } catch (error) {
      toast({
        title: "Error.",
        description: "Failed to fetch passwords",
        status: "error",
      });
    }
  };

  const createPassword = async () => {
    if (newEntry.platform === "") {
      toast({
        title: "Error",
        description: "Must include a platform",
        status: "error",
      });
      return;
    }
    try {
      const response = await fetch(`${host}/add_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
      });

      setIsAdding(false);
      setNewEntry({ platform: "", user: "", password: "" });
      fetchPasswords();
    } catch (error) {
      setStatus("Error creating password: " + error);
      toast({
        title: "Error",
        description: "Failed to create password.",
        status: "error",
      });
    }
  };

  const updatePassword = async (updatedEntry: PasswordEntry) => {
    try {
      const response = await fetch(
        `${host}/update_password/${updatedEntry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEntry),
        }
      );
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
      });

      fetchPasswords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password.",
        status: "error",
      });
    }
  };

  const deletePassword = async () => {
    if (!passwordToDelete) return;
    try {
      const response = await fetch(`${host}/del_password`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: passwordToDelete }),
      });
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
      });
      onClose();
      setPasswordToDelete(null);
      fetchPasswords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete password.",
        status: "error",
      });
      onClose();
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, [query, pagination.pageSize, pagination.pageIndex]);

  const [editedRows, setEditedRows] = useState<{ [key: string]: boolean }>({});

  const columnHelper = createColumnHelper<PasswordEntry>();

  const columns = [
    columnHelper.accessor("platform", {
      header: "Platform",
      cell: ({ row }) => (
        <Text style={{ fontWeight: "bold" }}>{row.original.platform}</Text>
      ),
      meta: { type: "text" } as ColumnMeta,
    }),
    columnHelper.accessor("user", {
      header: "Username",
      cell: TableCell,
      meta: { type: "text" } as ColumnMeta,
    }),
    columnHelper.accessor("password", {
      header: "Password",
      cell: TableCell,
      meta: { type: "text" } as ColumnMeta,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row, table }) => (
        <Flex gap={2}>
          <EditCell row={row} table={table} />
          <IconButton
            aria-label="Delete"
            icon={<MdRemove />}
            colorScheme="red"
            onClick={() => {
              setPasswordToDelete(row.original.id);
              onOpen();
            }}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalEntryCount / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setEntries((prev) =>
            prev.map((item, idx) =>
              idx === rowIndex ? originalData[rowIndex] : item
            )
          );
        } else {
          setOriginalData([...entries]);
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setEntries((prev) =>
          prev.map((item, idx) =>
            idx === rowIndex ? { ...item, [columnId]: value } : item
          )
        );
      },
      saveRow: (updatedRow: PasswordEntry) => {
        updatePassword(updatedRow);
      },
    },
  });

  return (
    <Flex
      direction="column"
      align="center"
      minH="100vh"
      bg={bgColor}
      color={textColor}
    >
      <Flex justify="space-between" w="100%" maxW="800px" align="center" mb={4}>
        <Heading>Passwords</Heading>
        <ColorModeSwitch
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
        />
      </Flex>

      {isAdding && (
        <Flex
          mb={4}
          w="100%"
          maxW="800px"
          align="center"
          bg={inputBgColor}
          p={4}
          borderRadius="md"
        >
          <Input
            placeholder="Platform"
            value={newEntry.platform}
            onChange={(e) =>
              setNewEntry({ ...newEntry, platform: e.target.value })
            }
            mr={2}
          />
          <Input
            placeholder="Username"
            value={newEntry.user}
            onChange={(e) => setNewEntry({ ...newEntry, user: e.target.value })}
            mr={2}
          />
          <Input
            placeholder="Password"
            value={newEntry.password}
            onChange={(e) =>
              setNewEntry({ ...newEntry, password: e.target.value })
            }
            mr={2}
          />
          <IconButton
            aria-label="Save"
            icon={<MdSave />}
            onClick={createPassword}
            colorScheme="green"
            mr={2}
          />
          <IconButton
            aria-label="Cancel"
            icon={<MdClose />}
            onClick={() => setIsAdding(false)}
            colorScheme="red"
          />
        </Flex>
      )}

      {!isAdding && (
        <Flex mb={4} w="100%" maxW="800px" align="center">
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            mr={2}
          />
          <IconButton
            aria-label="Refresh"
            icon={<MdRefresh />}
            onClick={fetchPasswords}
            mr={2}
          />
          <IconButton
            aria-label="Add"
            icon={<MdAdd />}
            onClick={() => setIsAdding(true)}
            colorScheme="green"
          />
        </Flex>
      )}

      {status && (
        <Box mb={4} p={2} bg={useColorModeValue("gray.100", "gray.800")}>
          {status}
        </Box>
      )}

      <Box w="100%" overflowX="auto">
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="space-between" w="100%" maxW="800px" mt={4}>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Flex align="center">
          <Text mr={2}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            w="120px"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </Select>
        </Flex>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Password</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this password?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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
