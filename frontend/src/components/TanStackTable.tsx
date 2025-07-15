import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex, Button } from '@chakra-ui/react';
import { useState } from 'react';

interface TanStackTableProps<T> {
  columns: any[];
  data: T[];
}

interface Identifiable {
  id: number;
}

const TanStackTable = <T extends Identifiable>({ columns, data }: TanStackTableProps<T>) => {

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} color="white">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.original.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} color="white">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt={4} justify="space-between">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          colorScheme="blue"
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          colorScheme="blue"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default TanStackTable;
