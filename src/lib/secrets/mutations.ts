import type { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export const insertSecret = (
  client: Client,
  { name, secret }: { name: string; secret: string },
) => {
  return client
    .rpc('insert_secret', {
      name,
      secret,
    })
    .throwOnError();
};

export const deleteSecret = (client: Client, id: string) => {
  return client
    .rpc('delete_secret', {
      v_id: id,
    })
    .throwOnError();
};
