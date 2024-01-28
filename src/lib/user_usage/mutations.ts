import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { ORGANIZATIONS_USAGE_TABLE } from '~/lib/db-tables';
import { IOrganizationUsage } from './types';
import { getOrganizationUsageById } from './queries';

type Client = SupabaseClient<Database>;

export function createOrganizationUsage(
  client: Client,
  organizationUsage: IOrganizationUsage,
) {
  return client.from(ORGANIZATIONS_USAGE_TABLE).upsert(organizationUsage, {
    onConflict: `organization_id`,
  });
}

export async function updateOrganizationUsage(
  client: Client,
  organizationUsage: IOrganizationUsage,
) {
  return await client
    .from(ORGANIZATIONS_USAGE_TABLE)
    .upsert(organizationUsage, {
      onConflict: `organization_id`,
    });
}

export async function incrementOrganizationGeneratedTokens(
  client: Client,
  organizationId: number,
  newGeneratedTokens: number,
) {
  const { data: userUsageData } = await getOrganizationUsageById(
    client,
    organizationId,
  ).throwOnError();

  const { data, error } = await client
    .from(ORGANIZATIONS_USAGE_TABLE)
    .update({
      tokens_generated: userUsageData!.tokens_generated + newGeneratedTokens,
    })
    .eq('organization_id', organizationId);

  if (error) {
    console.error(error);
  }

  return data;
}

export async function deleteOrganizationUsage(
  client: Client,
  organizationId: number,
) {
  return await client
    .from(ORGANIZATIONS_USAGE_TABLE)
    .delete()
    .eq('organization_id', organizationId);
}
