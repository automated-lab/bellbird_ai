import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';
import { SUBSCRIPTIONS_TABLE } from '~/lib/db-tables';

type Client = SupabaseClient<Database>;

export async function getSubscriptionByOrganizationId(
  client: Client,
  organizationId: string,
) {
  return client
    .from(SUBSCRIPTIONS_TABLE)
    .select('*, organizations_subscriptions (organization_id)')
    .eq('organizations_subscriptions.organization_id', organizationId)
    .throwOnError()
    .maybeSingle();
}
