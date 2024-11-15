'use client';
import { use } from 'react';

import DeleteCollectionModal from '../components/DeleteCollectionModal';

import useSupabase from '~/core/hooks/use-supabase';
import { getCopyCollectionById } from '~/lib/user_collections/queries';

interface Params {
  params: {
    collection_id: string;
  };
}

function DeleteCollectionModalPage({ params }: Params) {
  const client = useSupabase();

  const { data, error } = use(
    getCopyCollectionById(client, params.collection_id),
  );

  if (!data || error) {
    throw new Error(`Collection not found`);
  }

  return <DeleteCollectionModal collection={data} />;
}

export default DeleteCollectionModalPage;
