'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import useSWR from 'swr';

import { CheckIcon } from '@heroicons/react/24/outline';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/core/ui/Command';
import Loading from '~/components/Loading';
import CollectionMenu from './CollectionMenu';

import { getKeyIf, queryKeys } from '~/lib/query-keys';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
import useSupabase from '~/core/hooks/use-supabase';
import { getUserCollections } from '~/lib/user_collections/queries';
import useUserId from '~/core/hooks/use-user-id';
import If from '~/core/ui/If';
import { cn } from '~/core/generic/shadcn-utils';

import type { IUserCollection } from '~/lib/user_collections/types';

type CollectionsListProps = {
  className?: string;
  onSelectCollection: (collection: IUserCollection) => void;
};

const CollectionsList = ({
  className,
  onSelectCollection,
}: CollectionsListProps) => {
  const [selectedCollection, setSelectedCollection] =
    useState<IUserCollection | null>(null);

  const client = useSupabase();
  const userId = useUserId();
  const organization = useCurrentOrganization();

  const key = getKeyIf(queryKeys.userCollectionsRetrieve(userId), !!userId);
  const { data, isLoading } = useSWR(
    key,
    async () =>
      await getUserCollections(client, userId, organization.id)
        .throwOnError()
        .then(({ data }) => data),
  );

  return (
    <Command className={cn('border rounded-md h-full', className)}>
      <CommandInput placeholder="Search for a collection" />
      <CommandList className="">
        <CommandEmpty>
          <span>No collections found</span>
        </CommandEmpty>
        <CommandGroup heading="Collections">
          <If condition={isLoading}>
            <Loading />
          </If>
          {data?.map((collection) => {
            const isSelected = collection.id === selectedCollection?.id;
            return (
              <CommandItem
                key={collection.id}
                onSelect={() => {
                  setSelectedCollection(collection);
                  onSelectCollection(collection);
                }}
                className={classNames(
                  'cursor-pointer',
                  isSelected && 'bg-primary-100 dark:bg-primary-600',
                )}
              >
                {isSelected && (
                  <CheckIcon className="text-primary-600 dark:text-primary-200 h-4 w-4 mr-2" />
                )}
                <span>{collection.name}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <CollectionMenu collection_id={collection.id} />
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CollectionsList;
