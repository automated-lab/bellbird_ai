'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import IconButton from '~/core/ui/IconButton';
import Badge from '~/core/ui/Badge';
import Button from '~/core/ui/Button';
import RichDataTable from '~/core/ui/RichDataTable';

import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';
import type { ITemplateField } from '~/lib/fields/types';

const columns: Array<ColumnDef<ITemplateField>> = [
  {
    header: 'ID',
    id: 'id',
    cell: ({ row }) => {
      return (
        <Link
          className="hover:underline"
          href={`${ADMIN_NAVIGATION_CONFIG.fields.path}/${row.original.id}`}
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    header: 'Name',
    id: 'name',
    accessorFn: ({ name }) => name,
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
  },
  {
    header: 'Type',
    id: 'type',
    cell: ({ row }) => {
      return <span>{row.original.type}</span>;
    },
  },
  {
    header: 'Tag',
    id: 'field_tag',
    cell: ({ row }) => {
      return <span>{row.original.field_tag}</span>;
    },
  },
  {
    header: 'Default Value',
    id: 'defaultValue',
    cell: ({ row }) => {
      return <span>{row.original.default_value}</span>;
    },
  },
  {
    header: 'Required',
    id: 'isRequired',
    cell: ({ row }) => {
      if (row.original.is_required) {
        return (
          <Badge className="w-max" size={'small'} color="error">
            Required
          </Badge>
        );
      }

      return (
        <Badge className="w-max" size={'small'} color="info">
          Optional
        </Badge>
      );
    },
  },
  {
    header: '',
    id: 'actions',
    minSize: 10,
    cell: ({ row }) => {
      const field = row.original;
      return (
        <div className="flex justify-end items-center gap-2 w- pr-4">
          <Button
            variant="ghost"
            href={`${ADMIN_NAVIGATION_CONFIG.fields.path}/${row.original.id}`}
            round
            size="icon"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton>
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  className={
                    'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5'
                  }
                  href={`${ADMIN_NAVIGATION_CONFIG.fields.path}/${field.id}/delete`}
                >
                  Delete Field
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function FieldsTable({
  fields,
  page,
  pageCount,
  perPage,
}: React.PropsWithChildren<{
  fields: ITemplateField[];
  pageCount: number;
  page: number;
  perPage: number;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <RichDataTable
        tableProps={{
          'data-cy': 'admin-fields-table',
        }}
        onPaginationChange={({ pageIndex }) => {
          router.push(`${pathname}?page=${pageIndex + 1}`);
        }}
        pageIndex={page - 1}
        pageSize={perPage}
        pageCount={pageCount}
        data={fields}
        columns={columns}
      />
    </>
  );
}

export default FieldsTable;
