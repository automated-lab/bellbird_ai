import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { ORGANIZATION_USAGE_TABLE } from '~/lib/db-tables';
import { IOrganizationUsage } from './types';
import { getOrganizationUsageById } from './queries';
import getLogger from '~/core/logger';

type Client = SupabaseClient<Database>;
const logger = getLogger();

export function createOrganizationUsage(
  client: Client,
  organizationUsage: IOrganizationUsage,
) {
  return client.from(ORGANIZATION_USAGE_TABLE).upsert(organizationUsage, {
    onConflict: `organization_id`,
  });
}

export async function updateOrganizationUsage(
  client: Client,
  organizationUsage: IOrganizationUsage,
) {
  return await client.from(ORGANIZATION_USAGE_TABLE).upsert(organizationUsage, {
    onConflict: `organization_id`,
  });
}

export async function incrementOrganizationGeneratedTokens(
  client: Client,
  organizationId: number,
  newGeneratedTokens: number,
) {
  const { data: organizationUsageData, error: organizationUsageDataErr } =
    await getOrganizationUsageById(client, organizationId).throwOnError();

  if (
    organizationUsageDataErr ||
    organizationUsageData?.tokens_generated === undefined
  ) {
    throw organizationUsageDataErr;
  }

  const { data, error } = await client
    .from(ORGANIZATION_USAGE_TABLE)
    .update({
      tokens_generated:
        organizationUsageData.tokens_generated + newGeneratedTokens,
    })
    .eq('organization_id', organizationId);

  if (error) {
    logger.error(
      { error },
      'Failed to increment organization generated tokens',
    );
  }

  return data;
}

export async function deleteOrganizationUsage(
  client: Client,
  organizationId: number,
) {
  return await client
    .from(ORGANIZATION_USAGE_TABLE)
    .delete()
    .eq('organization_id', organizationId);
}
