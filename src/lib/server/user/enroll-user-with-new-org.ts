import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';

interface Params {
  client: SupabaseClient<Database>;
  organizationName: string;
  userId: string;
  create_user?: boolean;
}

/**
 * @name enrollUserWithNewOrg
 * @description Hnaldes the creation of a new organization
 * and creates a user and enrolls him to it by creating an owner membership.
 * @param client
 * @param organizationName
 * @param userId
 */
async function enrollUserWithNewOrg({
  client,
  organizationName,
  userId,
  create_user = false,
}: Params) {
  return client
    .rpc('enroll_user_with_new_org', {
      org_name: organizationName,
      user_id: userId,
      create_user,
    })
    .single<string>();
}

export default enrollUserWithNewOrg;
