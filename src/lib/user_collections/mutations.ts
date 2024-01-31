import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { COLLECTIONS_TABLE } from '~/lib/db-tables';
import { ICopyCollectionDraft } from './types';

type Client = SupabaseClient<Database>;

export async function createCopyCollection(
  client: Client,
  collectionData: ICopyCollectionDraft,
) {
  return await client
    .from(COLLECTIONS_TABLE)
    .insert(collectionData)
    .select('id')
    .single();
}

export async function deleteCopyCollectionById(
  client: Client,
  collection_id: number,
) {
  return await client.from(COLLECTIONS_TABLE).delete().eq('id', collection_id);
}
