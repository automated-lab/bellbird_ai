import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { FIELDS_TABLE } from '~/lib/db-tables';

import type { ITemplateField, ITemplateFieldForm } from '~/lib/fields/types';
import { ITemplateFieldsDraft } from '../template_fields/types';

type Client = SupabaseClient<Database>;

export function createField(client: Client, field: ITemplateFieldForm) {
  return getFieldsTable(client).insert(field).select('id').single();
}

export async function updateField(
  client: Client,
  fieldId: string,
  fieldUpdates: Partial<ITemplateField>,
) {
  return client.from(FIELDS_TABLE).update(fieldUpdates).eq('id', fieldId);
}

export function deleteFieldById(client: Client, fieldId: string) {
  return getFieldsTable(client).delete().eq('id', fieldId).maybeSingle();
}

function getFieldsTable(client: Client) {
  return client.from(FIELDS_TABLE);
}
