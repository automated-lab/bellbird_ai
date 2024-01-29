import React from 'react';
import Link from 'next/link';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import IconButton from '~/core/ui/IconButton';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

import configuration from '~/configuration';
import { getPath } from '~/navigation.config';

const CollectionMenu = ({ collection_id }: { collection_id: number }) => {
  const organizationUid = useCurrentOrganization().uuid;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton>
            <EllipsisHorizontalIcon className="w-4 h-4" />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            asChild
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5"
          >
            <Link
              href={`${getPath(organizationUid, configuration.paths.collections)}/${collection_id}/delete`}
            >
              Delete Collection
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CollectionMenu;
