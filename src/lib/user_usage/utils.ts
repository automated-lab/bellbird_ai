import { SupabaseClient } from '@supabase/supabase-js';

import { createOrganizationUsage } from './mutations';

import { Database } from '~/database.types';
import configuration from '~/configuration';
import { getPlanByPriceId } from '~/lib/stripe/utils';

type Client = SupabaseClient<Database>;

export const PLANS_LIST = configuration.stripe.products.flatMap((p) => p.plans);

/**
 * Creates an organization usage record based on the subscription priceId.
 *
 */
export const createOrganizationUsageByPriceId = async (
  client: Client,
  organizationId: number,
  priceId: string,
) => {
  let tokensLimit = null;

  tokensLimit = getPlanByPriceId(priceId)?.tokens_limit ?? 0;

  return await createOrganizationUsage(client, {
    organization_id: organizationId,
    tokens_generated: 0,
    tokens_limit: tokensLimit,
  });
};
