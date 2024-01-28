import { SupabaseClient } from '@supabase/supabase-js';

import { getPagination } from '~/core/generic/generic-utils';
import { DEFAULT_PAGE_SIZE } from '~/app/admin/admin.config';
import { FIELDS_TABLE } from '~/lib/db-tables';
import { ITemplateField } from '~/lib/fields/types';
import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export function getFields(client: Client, query?: string) {
  return client
    .from(FIELDS_TABLE)
    .select(query, { count: 'exact' })
    .returns<ITemplateField[]>();
}

export async function getPaginatedFields(
  client: Client,
  { page = 1, perPage = DEFAULT_PAGE_SIZE },
) {
  const { from, to } = getPagination(page, perPage);

  const { data, count, error } = await getFields(client).range(from, to);

  return {
    data,
    count,
    error,
  };
}

export async function getField(client: Client, field_id: string) {
  return await client
    .from(FIELDS_TABLE)
    .select()
    .eq('id', field_id)
    .returns()
    .single();
}
