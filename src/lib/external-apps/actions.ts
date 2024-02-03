'use server';

import crypto from 'crypto';

import { withAdminSession } from '~/core/generic/actions-utils';
import getSupabaseServerActionClient from '~/core/supabase/action-client';
import { IExternalApp } from './types';
import getLogger from '~/core/logger';
import { z } from 'zod';
import { createApp, deleteApp } from './mutations';
import { insertSecret } from '../secrets/mutations';
import { revalidatePath } from 'next/cache';
import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';

const getAdminClient = () => getSupabaseServerActionClient({ admin: true });

export const createNewAppAction = withAdminSession(
  async (params: { appName: string; csrfToken: string }) => {
    const client = getAdminClient();
    const logger = getLogger();

    const appName = getAppSchema().parse(params.appName);

    logger.info({ name: appName }, 'Creating new external app...');

    const secret = crypto.randomBytes(64).toString('hex');

    const { data: secretId, error: insertSecretErr } = await insertSecret(
      client,
      {
        name: appName,
        secret: secret,
      },
    );

    if (insertSecretErr || !secretId) {
      logger.error(
        { error: insertSecretErr?.message },
        'Error Inserting Secret',
      );
      throw new Error('Error Creating Secret');
    }

    const { error: createAppErr } = await createApp(client, {
      id: secretId,
      name: appName,
    });

    if (createAppErr) {
      logger.error(
        { error: createAppErr?.message },
        'Error Creating External App',
      );
      throw new Error('Error Creating External App');
    }

    logger.info({ name: appName }, 'External App created successfully.');

    revalidatePath(ADMIN_NAVIGATION_CONFIG.templates.path);

    return secret;
  },
);

export const deleteAppAction = withAdminSession(
  async ({ appId }: { appId: string; csrfToken: string }) => {
    const client = getAdminClient();

    const logger = getLogger();

    logger.info({ appId }, `Admin requested to delete an external app`);

    await deleteApp(client, appId);

    revalidatePath(ADMIN_NAVIGATION_CONFIG.templates.path);

    logger.info({ appId }, `External App deleted successfully`);

    return appId;
  },
);

const getAppSchema = () => {
  return z.string().min(3);
};
