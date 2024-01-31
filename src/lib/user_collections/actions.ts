'use server';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import { ICopyCollection } from './types';
import { createCopyCollection, deleteCopyCollectionById } from './mutations';
import getLogger from '~/core/logger';
import { z } from 'zod';
import { withSession } from '~/core/generic/actions-utils';
import configuration from '~/configuration';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const getClient = () => getSupabaseServerActionClient({ admin: true });

export const createCopyCollectionAction = withSession(
  async (params: { collectionData: ICopyCollection; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();
    const collectionData = getCopyCollectionSchema().parse(
      params.collectionData,
    );

    logger.info('Creating user collection...');

    const { data: collectionId, error } = await createCopyCollection(
      client,
      collectionData,
    );

    if (error) {
      logger.error(error.message, 'Error creating user collection');
      throw new Error('Error creating user collection');
    }

    logger.info(
      { name: collectionData.name },
      'User collection created successfully.',
    );

    return collectionId;
  },
);

export const deleteCopyCollectionAction = withSession(
  async (params: { collectionId: number; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();

    const collectionId = params.collectionId;

    logger.info({ collectionId }, `User requested to delete a collection`);

    const { error } = await deleteCopyCollectionById(client, collectionId);

    if (error) {
      logger.error(error.message, 'Error deleting user collection');
      throw new Error('Error deleting user collection');
    }

    logger.info({ collectionId }, 'User collection deleted successfully.');

    revalidatePath(configuration.paths.collections);
  },
);

const getCopyCollectionSchema = () => {
  return z.object({
    organization_id: z.number(),
    user_id: z.string().min(2),
    name: z.string().min(2),
  });
};
