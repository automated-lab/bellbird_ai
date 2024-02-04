import { SupabaseClient } from '@supabase/supabase-js';

import { DEFAULT_PAGE_SIZE } from '~/app/admin/admin.config';
import { getPagination } from '~/core/generic/generic-utils';
import { EXTERNAL_APPS_TABLE } from '~/lib/db-tables';

import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export const getApp = (client: Client, appId: string) => {
  return client.from(EXTERNAL_APPS_TABLE).select(`*`).eq('id', appId);
};

export const getApps = (client: Client) => {
  return client.from(EXTERNAL_APPS_TABLE).select(`*`, { count: 'exact' });
};

export async function getPaginatedApps(
  client: Client,
  { page = 1, perPage = DEFAULT_PAGE_SIZE },
) {
  const { from, to } = getPagination(page, perPage);

  return getApps(client).range(from, to);
}
