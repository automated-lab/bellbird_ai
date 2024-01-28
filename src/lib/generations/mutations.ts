import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { GENERATIONS_TABLE } from '~/lib/db-tables';
import { IGenerationCopy } from '~/lib/generations/types';

type Client = SupabaseClient<Database>;

export async function createGenerationCopy(
  client: Client,
  generation_copy: IGenerationCopy,
) {
  return await client
    .from(GENERATIONS_TABLE)
    .insert(generation_copy)
    .select('id')
    .single();
}

export function deleteCopyFromCollection(
  client: Client,
  openai_id: string,
  collection_id: string,
) {
  return client
    .from(GENERATIONS_TABLE)
    .delete()
    .match({ openai_id, collection_id });
}
