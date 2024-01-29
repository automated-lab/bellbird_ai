'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

import Loading from '~/components/Loading';
import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';
import CollectionsList from './components/CollectionsList';
import GenerationCard from './components/GenerationCard';

import useSupabase from '~/core/hooks/use-supabase';
import { getGenerationsByCollectionId } from '~/lib/generations/queries';
import { getKeyIf, queryKeys } from '~/lib/query-keys';

import type { IUserCollection } from '~/lib/user_collections/types';

interface MyCollectionsPageProps {}

function MyCollectionsPage({}: MyCollectionsPageProps) {
  const client = useSupabase();

  const [selectedCollectionId, setSelectedCollectionId] = useState(NaN);

  const key = getKeyIf(
    queryKeys.collectionGenerationsRetrieve(selectedCollectionId),
    !!selectedCollectionId,
  );
  const { data, isLoading } = useSWR(
    key,
    async () =>
      await getGenerationsByCollectionId(client, selectedCollectionId)
        .throwOnError()
        .then(({ data }) => data),
  );

  return (
    <div className="space-y-6">
      <header>
        <Heading type={4}>Welcome to Your saved collections</Heading>

        <p className="text-gray-500 dark:text-gray-400">
          <span>Let&apos;s make something cool today!</span>
        </p>
      </header>
      <section className="flex flex-col md:flex-row gap-4">
        <CollectionsList
          className="flex-1 z-10"
          onSelectCollection={(collectionData: IUserCollection) =>
            setSelectedCollectionId(collectionData.id)
          }
        />
        <div className="flex-[2] flex flex-col gap-2">
          <div className="flex justify-end rounded-sm"></div>
          <If condition={isLoading}>
            <Loading />
          </If>
          <If condition={data?.length === 0}>
            <h3 className="text-center">No Generations found!</h3>
          </If>
          {data?.map((data) => (
            <GenerationCard key={data?.openai_id} data={data} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyCollectionsPage;
