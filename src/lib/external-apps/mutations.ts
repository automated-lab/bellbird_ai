import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';
import { EXTERNAL_APPS_TABLE } from '../db-tables';
import { deleteSecret } from '~/lib/secrets/mutations';

type Client = SupabaseClient<Database>;

export const createApp = (
  client: Client,
  { id, name }: { id: string; name: string },
) => {
  return client.from(EXTERNAL_APPS_TABLE).insert({
    id,
    name,
  });
};

export const deleteApp = async (client: Client, id: string) => {
  await deleteSecret(client, id);

  return client.from(EXTERNAL_APPS_TABLE).delete().eq('id', id);
};
