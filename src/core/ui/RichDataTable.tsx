'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { Table as ReactTable } from '@tanstack/react-table';

import classNames from 'classnames';
import Button from '~/core/ui/Button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import { TextFieldInput } from '~/core/ui/TextField';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';
import IconButton from './IconButton';

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  tableProps?: React.ComponentProps<typeof Table> & {
    [attr: `data-${string}`]: string;
  };
}

function RichDataTable<T extends object>({
  data,
  columns,
  renderSubComponent,
  pageIndex,
  pageSize,
  pageCount,
  onPaginationChange,
  tableProps,
}: ReactTableProps<T>) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 15,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onPaginationChange: setPagination,
  });

  React.useEffect(() => {
    if (pagination.pageIndex === pageIndex) return;

    onPaginationChange?.(pagination);
  }, [onPaginationChange, pageIndex, pagination]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <TextFieldInput
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {(column.columnDef.header as string) || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={'border border-gray-50 dark:border-dark-800 rounded-md p-1'}
      >
        <Table {...tableProps}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      colSpan={header.colSpan}
                      style={{
                        width: header.column.getSize(),
                      }}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={classNames({
                      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted':
                        row.getIsExpanded(),
                    })}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        style={{
                          width: cell.column.getSize(),
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubComponent ? (
                    <TableRow key={row.id + '-expanded'}>
                      <TableCell colSpan={columns.length}>
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination table={table} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default RichDataTable;

function Pagination<T>({
  table,
}: React.PropsWithChildren<{
  table: ReactTable<T>;
}>) {
  return (
    <div className="flex items-center gap-2 w-full">
      <IconButton
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronDoubleLeftIcon className={'h-4'} />
      </IconButton>

      <IconButton
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon className={'h-4'} />
      </IconButton>

      <IconButton
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon className={'h-4'} />
      </IconButton>

      <IconButton
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronDoubleRightIcon className={'h-4'} />
      </IconButton>

      <span className="flex items-center gap-1 text-sm">
        <div>Page</div>

        <div>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </span>
    </div>
  );
}
