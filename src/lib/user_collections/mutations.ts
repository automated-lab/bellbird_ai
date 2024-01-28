import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { COLLECTIONS_TABLE } from '~/lib/db-tables';
import { IUserCollectionDraft } from './types';

type Client = SupabaseClient<Database>;

export async function createUserCollection(
  client: Client,
  collectionData: IUserCollectionDraft,
) {
  return await client
    .from(COLLECTIONS_TABLE)
    .insert(collectionData)
    .select('id')
    .single();
}

export async function deleteUserCollectionById(
  client: Client,
  collection_id: string,
) {
  return await client.from(COLLECTIONS_TABLE).delete().eq('id', collection_id);
}
