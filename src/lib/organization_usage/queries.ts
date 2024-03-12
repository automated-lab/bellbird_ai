import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { ORGANIZATION_USAGE_TABLE } from '~/lib/db-tables';

type Client = SupabaseClient<Database>;

export function getOrganizationUsageById(
  client: Client,
  organizationId: number,
) {
  return client
    .from(ORGANIZATION_USAGE_TABLE)
    .select(`*`)
    .eq('organization_id', organizationId)
    .maybeSingle();
}

/**
 * Returns the number of remaining tokens for an organization.
 */
export async function getOrganizationRemainingTokens(
  client: Client,
  organizationId: number,
) {
  const { data } = await getOrganizationUsageById(
    client,
    organizationId,
  ).throwOnError();

  if (!data) {
    return 0;
  }

  const { tokens_limit, tokens_generated } = data;
  const remaining_tokens = tokens_limit - tokens_generated;

  return Math.max(0, remaining_tokens);
}
