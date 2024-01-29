'use client';

import React, { ChangeEvent, useState } from 'react';
import { CheckIcon, HeartIcon, PlusIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';
import { toast } from 'sonner';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/core/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '~/core/ui/Popover';
import Button from '~/core/ui/Button';

import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';
import Loading from '~/components/Loading';

import useSupabase from '~/core/hooks/use-supabase';
import useUserId from '~/core/hooks/use-user-id';
import { getUserCollections } from '~/lib/user_collections/queries';
import { createUserCollection } from '~/lib/user_collections/mutations';
import {
  createGenerationCopy,
  deleteCopyFromCollection,
} from '~/lib/generations/mutations';
import { getGenerationCollectionsByAiId } from '~/lib/generations/queries';

import type { IGenerationCopy } from '~/lib/generations/types';
import type { IUserCollection } from '~/lib/user_collections/types';
import { getKeyIf, queryKeys } from '~/lib/query-keys';
import { useCurrentOrganizationId } from '~/lib/organizations/hooks/use-current-organization-id';

type GenerationSaveButtonProps = {
  generationCopy: IGenerationCopy;
};

function GenerationSaveButton({ generationCopy }: GenerationSaveButtonProps) {
  const client = useSupabase();
  const userId = useUserId();
  const organizationId = useCurrentOrganizationId();

  // Fetch current user collections
  const userCollectionsKey = getKeyIf(
    queryKeys.organizationCollectionsRetrieve(organizationId),
    !!organizationId,
  );
  const userCollections = useSWR<IUserCollection[]>(
    userCollectionsKey,
    async () =>
      await getUserCollections(client, userId, organizationId)
        .throwOnError()
        .then(({ data }) => data as IUserCollection[]),
  );

  // Fetch collections copy already saved to
  const copyCollectionsKey = getKeyIf(
    queryKeys.copyCollectionsRetrieve(generationCopy.openai_id),
    !!generationCopy.openai_id,
  );
  const copyCollections = useSWR(
    copyCollectionsKey,
    async () =>
      await getGenerationCollectionsByAiId(client, generationCopy.openai_id)
        .throwOnError()
        .then(({ data }) => data?.map((r) => r.collection_id)),
  );

  // Create new user collection
  const createNewCollection = async (name: string) => {
    const { data, error } = await createUserCollection(client, {
      name,
      organization_id: organizationId,
      user_id: userId,
    });

    if (error) {
      return toast.error('Error creating collection');
    }

    toast.success('Collection created');

    saveToCollection(data.id);
    userCollections.mutate();
  };

  // Save copy to a collection
  const saveToCollection = async (collectionId: number) => {
    const { id, openai_id, template_id, ...generationCopyData } =
      generationCopy;

    const { error } = await createGenerationCopy(client, {
      ...generationCopyData,
      openai_id,
      template_id,
      collection_id: collectionId,
      user_id: userId,
    });
    console.log(collectionId, userId, generationCopy);

    if (error) {
      console.error(error.message);
      return toast.error('Error saving to collection');
    }

    toast.success('Saved successfully');
    copyCollections.mutate();
  };

  const removeFromCollection = async (collection_id: number) => {
    const { error } = await deleteCopyFromCollection(
      client,
      generationCopy.openai_id,
      collection_id,
    );

    if (error) {
      console.error(error.message);
      return toast.error('Error removing from collection');
    }

    toast.success('Removed successfully');
    copyCollections.mutate();
  };

  if (!userId) return null;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-full">
            <HeartIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Choose Collection" />
            <CommandList>
              {/* <CommandEmpty className="p-0"></CommandEmpty> */}
              <If condition={userCollections.isLoading}>
                <Loading />
              </If>
              <CommandGroup>
                {userCollections.data?.map(({ id, name }) => {
                  let isSelected = copyCollections.data?.includes(id);

                  return (
                    <CommandItem key={id} disabled={isSelected}>
                      {isSelected && <CheckIcon className="mr-2 h-4 w-4" />}
                      {name}
                      {isSelected ? (
                        <Button
                          variant="link"
                          compact
                          size="small"
                          className="ml-auto text-red-600"
                          onClick={() => removeFromCollection(id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          compact
                          size="small"
                          className="ml-auto"
                          onClick={() => saveToCollection(id)}
                        >
                          Save
                        </Button>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandGroup>
                <CreateCollectionButton onSubmit={createNewCollection} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const CreateCollectionButton = ({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) => {
  const [createMode, setCreateMode] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      return setError('collection name is required');
    }

    setError('');
    onSubmit(name ?? '');
    setCreateMode(false);
  };

  return (
    <>
      {createMode ? (
        <form onSubmit={handleSubmit} className="space-y-1">
          <TextField.Input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Collection name"
          />
          <TextField.Error error={error} />
          <Button className="w-full h-full" variant="outline" disabled={!name}>
            Submit
          </Button>
        </form>
      ) : (
        <Button
          onClick={() => setCreateMode(true)}
          className="w-full h-full"
          variant="ghost"
        >
          Create a collection <PlusIcon className="w-4 h-4 ml-4" />
        </Button>
      )}
    </>
  );
};

export default GenerationSaveButton;
