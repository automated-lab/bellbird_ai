import { use } from 'react';

import useSupabase from '~/core/hooks/use-supabase';
import { getUserCollectionById } from '~/lib/user_collections/queries';
import DeleteCollectionModal from '../components/DeleteCollectionModal';

interface Params {
  params: {
    collection_id: string;
  };
}

function DeleteCollectionModalPage({ params }: Params) {
  const client = useSupabase();

  const { data, error } = use(
    getUserCollectionById(client, params.collection_id),
  );

  console.log(data, error);

  if (!data || error) {
    throw new Error(`Collection not found`);
  }

  return <DeleteCollectionModal collection={data} />;
}

export default DeleteCollectionModalPage;
