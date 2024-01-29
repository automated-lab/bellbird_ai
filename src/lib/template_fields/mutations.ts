import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { TEMPLATE_FIELDS } from '~/lib/db-tables';
import { ITemplateFieldsDraft } from './types';

type Client = SupabaseClient<Database>;

export async function insertTemplateFields(
  client: Client,
  templateFields: ITemplateFieldsDraft | ITemplateFieldsDraft[],
) {
  if (!Array.isArray(templateFields)) {
    templateFields = [templateFields];
  }

  return client.from(TEMPLATE_FIELDS).insert(templateFields);
}

export async function deleteTemplateFields(client: Client, templateId: number) {
  return client.from(TEMPLATE_FIELDS).delete().eq('template_id', templateId);
}
