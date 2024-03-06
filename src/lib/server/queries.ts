import { SupabaseClient } from '@supabase/supabase-js';

import type UserData from '~/core/session/types/user-data';
import type { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

/**
 * @description Fetch user object data (not auth!) by ID {@link userId}
 */
export async function getUserDataById(client: SupabaseClient, userId: string) {
  const result = await client
    .from('users')
    .select<string, UserData>(
      `
      id,
      displayName: display_name,
      photoUrl: photo_url,
      onboarded
    `,
    )
    .eq('id', userId)
    .maybeSingle();

  return result.data;
}

export async function getUserIdByEmail(client: Client, email: string) {
  return client.rpc('get_user_id_by_email', {
    email,
  });
}
