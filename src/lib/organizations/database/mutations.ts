import type { SupabaseClient } from '@supabase/supabase-js';

import {
  ORGANIZATIONS_SUBSCRIPTIONS_TABLE,
  ORGANIZATIONS_TABLE,
} from '~/lib/db-tables';

import type Organization from '~/lib/organizations/types/organization';
import type { Database } from '~/database.types';
import { getOrganizationByUid } from '~/lib/organizations/database/queries';

type OrganizationRow = Database['public']['Tables']['organizations']['Row'];

type Client = SupabaseClient<Database>;

/**
 * @name updateOrganization
 * @param client
 * @param params
 */
export async function updateOrganization(
  client: Client,
  params: {
    id: number;
    data: Partial<Organization>;
  },
) {
  const payload: Omit<Partial<OrganizationRow>, 'id'> = {
    name: params.data.name,
  };

  if ('logoURL' in params.data) {
    payload.logo_url = params.data.logoURL;
  }

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .update(payload)
    .eq('id', params.id)
    .select('id, name')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * @name setOrganizationSubscriptionData
 * @description Adds or updates a subscription to an Organization
 */
export function setOrganizationSubscriptionData(
  client: Client,
  props: {
    organizationId: number;
    customerId: string;
    subscriptionId: string;
  },
) {
  const { customerId, organizationId, subscriptionId } = props;

  return client
    .from(ORGANIZATIONS_SUBSCRIPTIONS_TABLE)
    .upsert(
      {
        customer_id: customerId,
        subscription_id: subscriptionId,
        organization_id: organizationId,
      },
      {
        onConflict: 'organization_id',
      },
    )
    .match({ organization_id: organizationId });
}
