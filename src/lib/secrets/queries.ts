import type { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export const getAppIdBySecret = (client: Client, secret: string) => {
  return client.rpc('read_id', {
    v_secret: secret,
  });
};
