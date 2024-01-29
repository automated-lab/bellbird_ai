import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { GENERATIONS_TABLE } from '../db-tables';

type Client = SupabaseClient<Database>;

export function getGenerationsByCollectionId(
  client: Client,
  collectionId: number,
) {
  return client
    .from(GENERATIONS_TABLE)
    .select('*')
    .eq('collection_id', collectionId);
}

export function getGenerationCollectionsByAiId(
  client: Client,
  openai_id: string,
) {
  return client
    .from(GENERATIONS_TABLE)
    .select(`collection_id`)
    .eq('openai_id', openai_id);
}
