import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { COLLECTIONS_TABLE } from '~/lib/db-tables';

type Client = SupabaseClient<Database>;

export async function getUserCollectionById(
  client: Client,
  collection_id: string,
) {
  return await client
    .from(COLLECTIONS_TABLE)
    .select(`*, generations_copies(*)`)
    .eq('id', collection_id)
    .single();
}

export function getUserCollections(
  client: Client,
  userId: string,
  organizationId: number,
) {
  return client
    .from(COLLECTIONS_TABLE)
    .select(`*`)
    .match({ user_id: userId, organization_id: organizationId });
}

export function getOrganizationCollections(
  client: Client,
  organizationId: number,
) {
  return client
    .from(COLLECTIONS_TABLE)
    .select(`*`)
    .eq('organization_id', organizationId);
}
