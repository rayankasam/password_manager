import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex, Button, Select, Text, ColorMode } from '@chakra-ui/react';

interface TanStackTableProps<T> {
  columns: any[];
  data: T[];
  colorMode: ColorMode;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
}

interface Identifiable {
  id: number;
}

const TanStackTable = <T extends Identifiable>({ 
  columns, 
  data = [],
  colorMode,
  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  pageCount = 1,
}: TanStackTableProps<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!onPaginationChange,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: onPaginationChange,
  });
  const textColor = colorMode === "dark" ? "white" : "black"

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} color={textColor}>
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
                <Td key={cell.id} color={textColor}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      <Flex mt={4} justify="space-between" align="center">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          colorScheme="blue"
        >
          Previous
        </Button>
        
        <Flex align="center" gap={3}>
          <Text fontSize="sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
          
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              table.setPageSize(newPageSize);
              if (onPaginationChange) {
                onPaginationChange({
                  ...table.getState().pagination,
                  pageSize: newPageSize,
                });
              }
            }}
            width="120px"
            size="sm"
          >
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>
        
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
