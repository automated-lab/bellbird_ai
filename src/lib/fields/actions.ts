'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { withAdminSession } from '~/core/generic/actions-utils';
import getSupabaseServerActionClient from '~/core/supabase/action-client';
import getLogger from '~/core/logger';
import { getFieldSchema } from '~/lib/fields/validation';
import {
  createField,
  deleteFieldById,
  updateField,
} from '~/lib/fields/mutations';
import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';

import { type ITemplateFieldForm } from '~/lib/fields/types';
import { FIELDS_TABLE } from '../db-tables';

const getClient = () => getSupabaseServerActionClient({ admin: true });

export const createNewFieldAction = withAdminSession(
  async (params: { fieldData: ITemplateFieldForm; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();

    logger.info('Creating new field...');

    const fieldData = getFieldSchema().parse(params.fieldData);

    const { count } = await client
      .from(FIELDS_TABLE)
      .select('field_tag', { count: 'exact' })
      .eq('field_tag', fieldData.field_tag);

    logger.info(
      { field_tag: fieldData.field_tag },
      'Error Field tag already exists',
    );

    if (count! > 0) throw new Error('Field tag already exists');

    logger.info({ name: fieldData.name }, 'Creating new field...');

    const { data: fieldId, error: fieldError } = await createField(
      client,
      fieldData,
    );

    if (fieldError) {
      logger.error(fieldError.message, 'Error creating field');
      throw new Error('Error creating field');
    }

    logger.info({ name: fieldData.name }, 'Field created successfully.');

    revalidatePath(ADMIN_NAVIGATION_CONFIG.fields.path);
    // redirect(ADMIN_NAVIGATION_CONFIG.fields.path);
    return;
  },
);

export const updateFieldAction = withAdminSession(
  async (params: {
    fieldId: string;
    fieldUpdates: Partial<ITemplateFieldForm>;
    csrfToken: string;
  }) => {
    const client = getClient();
    const logger = getLogger();

    const fieldUpdates = getFieldSchema().partial().parse(params.fieldUpdates);

    logger.info('Updating field...');

    const { error } = await updateField(client, params.fieldId, fieldUpdates);

    if (error) {
      logger.error(error.message, 'Failed to update field');
      throw new Error('Failed to update field');
    }

    logger.info('Field updated successfully!');

    revalidatePath(ADMIN_NAVIGATION_CONFIG.fields.path);
    return;
  },
);

export const deleteFieldAction = withAdminSession(
  async ({ fieldId }: { fieldId: string; csrfToken: string }) => {
    const client = getClient();

    const logger = getLogger();

    logger.info({ fieldId }, `Admin requested to delete a field`);

    await deleteFieldById(client, fieldId);

    revalidatePath(ADMIN_NAVIGATION_CONFIG.fields.path);

    logger.info({ fieldId }, `Field deleted`);

    redirect(ADMIN_NAVIGATION_CONFIG.fields.path);
  },
);
