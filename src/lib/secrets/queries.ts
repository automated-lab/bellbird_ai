import type { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export const getSecret = (client: Client, secret: string) => {
  return client.rpc('read_secret', {
    v_secret: secret,
  });
};
