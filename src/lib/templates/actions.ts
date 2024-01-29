'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { withAdminSession } from '~/core/generic/actions-utils';
import getSupabaseServerActionClient from '~/core/supabase/action-client';
import getLogger from '~/core/logger';

import { getTemplateSchema } from '~/lib/templates/validation';
import {
  createTemplate,
  deleteTemplateById,
  deleteTemplateImage,
  updateTemplate,
  uploadTemplateImage,
} from '~/lib/templates/mutation';
import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';
import verifyCsrfToken from '~/core/verify-csrf-token';

import type { ITemplateDraft } from '~/lib/templates/types';

const getClient = () => getSupabaseServerActionClient({ admin: true });

export const createNewTemplateAction = withAdminSession(
  async (params: { templateData: ITemplateDraft; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();

    logger.info('Creating new template...');

    const templateData = getTemplateSchema().parse(params.templateData);

    logger.info({ title: templateData.title }, 'Creating new template...');

    const { error } = await createTemplate(client, templateData);

    if (error) {
      logger.error(error.message, 'Error creating template');
      throw new Error('Error creating template');
    }

    logger.info(
      { title: templateData.title },
      'Template created successfully.',
    );

    revalidatePath(ADMIN_NAVIGATION_CONFIG.templates.path);
    redirect(ADMIN_NAVIGATION_CONFIG.templates.path);
  },
);

export const updateTemplateAction = withAdminSession(
  async (params: {
    templateId: number;
    templateUpdates: Partial<ITemplateDraft>;
    csrfToken: string;
  }) => {
    const client = getClient();
    const logger = getLogger();

    const templateUpdates = getTemplateSchema()
      .partial()
      .parse(params.templateUpdates);

    console.log(templateUpdates, params.templateId);

    logger.info({ title: templateUpdates.title }, 'Updating template...');

    const { error } = await updateTemplate(
      client,
      params.templateId,
      templateUpdates,
    );

    if (error) {
      logger.error(error.message, 'Error updating template');
      throw new Error('Error updating template');
    }

    logger.info(
      { title: templateUpdates.title },
      'Template updated successfully.',
    );

    revalidatePath(ADMIN_NAVIGATION_CONFIG.templates.path);
    redirect(ADMIN_NAVIGATION_CONFIG.templates.path);
  },
);

export const uploadTemplateImageAction = withAdminSession(
  async (formData: FormData) => {
    const image = formData.get('image') as File;
    const templateId = formData.get('templateId') as string;
    const csrfToken = formData.get('csrfToken') as string;

    if (!image?.name) {
      throw new Error('Image is required');
    }

    if (!csrfToken) {
      throw new Error('CSRF token is required');
    }

    await verifyCsrfToken(csrfToken);

    const client = getClient();
    const logger = getLogger();

    logger.info('Uploading template image...');

    const { data: imageUrl, error } = await uploadTemplateImage(
      client,
      templateId,
      image,
    );

    if (error) {
      logger.error({ error }, 'Error uploading template image');
      throw new Error('Error uploading template image');
    }

    await deleteTemplateImage(client, templateId);

    logger.info('Template image uploaded successfully');

    return imageUrl;
  },
);

export const updateTemplateImageAction = withAdminSession(
  async (formData: FormData) => {
    const image = formData.get('image') as File;
    const templateId = formData.get('templateId') as string;
    const csrfToken = formData.get('csrfToken') as string;

    if (!image?.name) {
      throw new Error('Image is required');
    }

    if (!csrfToken) {
      throw new Error('CSRF token is required');
    }

    await verifyCsrfToken(csrfToken);

    const client = getClient();
    const logger = getLogger();

    logger.info('Updating template image...');

    const { data: imageUrl, error } = await uploadTemplateImage(
      client,
      templateId,
      image,
    );

    if (error) {
      logger.error('Error updating template image');
      throw new Error('Error updating template image');
    }

    logger.info('Template image updated successfully');

    return imageUrl;
  },
);

export const deleteTemplateAction = withAdminSession(
  async ({ templateId }: { templateId: string; csrfToken: string }) => {
    const client = getClient();

    const logger = getLogger();

    logger.info({ templateId }, `Admin requested to delete a template`);

    await deleteTemplateById(client, templateId);

    revalidatePath(ADMIN_NAVIGATION_CONFIG.templates.path);

    logger.info({ templateId }, `Template deleted`);

    redirect(ADMIN_NAVIGATION_CONFIG.templates.path);
  },
);
