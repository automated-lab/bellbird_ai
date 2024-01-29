import { SupabaseClient } from '@supabase/supabase-js';

import { TEMPLATES_TABLE } from '~/lib/db-tables';
import { DEFAULT_PAGE_SIZE } from '~/app/admin/admin.config';
import { getPagination } from '~/core/generic/generic-utils';

import { ITemplate } from '~/lib/templates/types';

import { Database } from '~/database.types';

type Client = SupabaseClient<Database>;

export function getTemplates(client: Client) {
  return client
    .from(TEMPLATES_TABLE)
    .select(`id, title, description, category, image, isNew`, {
      count: 'exact',
    });
}

export function getPaginatedTemplates(
  client: Client,
  { page = 1, perPage = DEFAULT_PAGE_SIZE },
) {
  const { from, to } = getPagination(page, perPage);

  return getTemplates(client).range(from, to);
}

export function getTemplateById(client: Client, templateId: string) {
  return client
    .from(TEMPLATES_TABLE)
    .select('id, title, category, image, description, fields(*)')
    .eq('id', templateId)
    .returns<ITemplate[]>()
    .single();
}

export function getTemplatePrompt(client: Client, templateId: string) {
  return client
    .from(TEMPLATES_TABLE)
    .select('id, prompt')
    .eq('id', templateId)
    .single();
}

export function getTemplateWithPrompt(client: Client, templateId: string) {
  return client
    .from(TEMPLATES_TABLE)
    .select(
      'id, title, category, image, description, prompt, fields(id, field_tag, name)',
    )
    .eq('id', templateId)
    .single();
}
