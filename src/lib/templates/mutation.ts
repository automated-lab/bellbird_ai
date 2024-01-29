import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/database.types';
import { TEMPLATES_TABLE } from '~/lib/db-tables';
import type { ITemplateDraft } from '~/lib/templates/types';
import {
  deleteTemplateFields,
  insertTemplateFields,
} from '~/lib/template_fields/mutations';

type Client = SupabaseClient<Database>;

export async function createTemplate(client: Client, template: ITemplateDraft) {
  const { fields, ...templateWithoutFields } = template;

  const { data: templateData, error: templateError } = await client
    .from(TEMPLATES_TABLE)
    .insert(templateWithoutFields)
    .select('id')
    .single();

  if (!templateData?.id || templateError) {
    return {
      error: templateError,
      data: null,
    };
  }

  const fieldsData = (fields as number[]).map((fieldId) => ({
    template_id: templateData.id,
    field_id: fieldId,
  }));

  const { error: templateFieldError } = await insertTemplateFields(
    client,
    fieldsData,
  );

  if (templateFieldError) {
    // TODO: We should not remove the template, we'll save it as draft
    await deleteTemplateById(client, templateData.id);

    return {
      error: templateFieldError,
      data: null,
    };
  }

  return {
    error: null,
    data: templateData.id,
  };
}

export async function updateTemplate(
  client: Client,
  templateId: string,
  updates: Partial<ITemplateDraft>,
) {
  const { fields, ...templateUpdates } = updates;

  const { data: template, error } = await client
    .from(TEMPLATES_TABLE)
    .update(templateUpdates)
    .eq('id', templateId)
    .select();

  if (error) {
    return { error, data: null };
  }

  console.log(updates);

  if (fields) {
    const fieldsData = fields.map((fieldId: number) => ({
      template_id: templateId,
      field_id: fieldId,
    }));

    await deleteTemplateFields(client, templateId);

    const { error: fieldsError } = await insertTemplateFields(
      client,
      fieldsData,
    );

    if (fieldsError) {
      return { error: fieldsError, data: null };
    }
  }

  return { data: template, error: null };
}

export async function deleteTemplateById(client: Client, template_id: string) {
  return await client.from(TEMPLATES_TABLE).delete().eq('id', template_id);
}

export async function uploadTemplateImage(
  client: Client,
  id: string,
  imageFile: File,
) {
  const bytes = await imageFile.arrayBuffer();
  const bucket = client.storage.from('templates/cards');
  const extension = imageFile.name.split('.').pop();
  const name = `${id}.${extension}`;
  console.log(name);

  const { error } = await bucket.upload(name, bytes, {
    upsert: true,
  });

  if (error) {
    return { data: null, error };
  }

  return { data: bucket.getPublicUrl(name).data.publicUrl, error: null };
}

export async function deleteTemplateImage(client: Client, id: string) {
  const bucket = client.storage.from('templates/cards');
  const { error } = await bucket.remove([id]);

  if (error) {
    return { data: null, error };
  }

  return { data: true, error: null };
}
