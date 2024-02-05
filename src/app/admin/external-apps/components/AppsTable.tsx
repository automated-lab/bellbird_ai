'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { TrashIcon } from '@heroicons/react/24/outline';

import DataTable from '~/core/ui/DataTable';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

import IconButton from '~/core/ui/IconButton';
import { DeleteAppModal } from './DeleteAppModal';

type AppRow = {
  id: string;
  name: string;
};

const columns: Array<ColumnDef<AppRow>> = [
  {
    header: 'ID',
    id: 'id',
    size: 30,
    cell: ({ row }) => {
      const id = row.original.id;

      return <p>{id}</p>;
    },
  },
  {
    header: 'Name',
    size: 50,
    id: 'displayName',
    cell: ({ row }) => {
      return row.original.name ?? '';
    },
  },
  {
    header: '',
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Tooltip>
            <DeleteAppModal app={row.original}>
              <TooltipTrigger asChild>
                <IconButton className="text-red-500">
                  <TrashIcon className="w-4 h-4" />
                </IconButton>
              </TooltipTrigger>
            </DeleteAppModal>

            <TooltipContent>Delete {row.original.name} app</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

function AppsTable({
  apps,
  page,
  pageCount,
  perPage,
}: React.PropsWithChildren<{
  apps: AppRow[];
  pageCount: number;
  page: number;
  perPage: number;
}>) {
  return (
    <DataTable
      tableProps={{
        'data-cy': 'admin-apps-table',
      }}
      pageIndex={page - 1}
      pageSize={perPage}
      pageCount={pageCount}
      data={apps}
      columns={columns}
    />
  );
}

export default AppsTable;
