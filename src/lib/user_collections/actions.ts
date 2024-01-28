'use server';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import { IUserCollection } from './types';
import { createUserCollection, deleteUserCollectionById } from './mutations';
import getLogger from '~/core/logger';
import { z } from 'zod';
import { withSession } from '~/core/generic/actions-utils';
import configuration from '~/configuration';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const getClient = () => getSupabaseServerActionClient({ admin: true });

export const createUserCollectionAction = withSession(
  async (params: { collectionData: IUserCollection; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();
    const collectionData = getUserCollectionSchema().parse(
      params.collectionData,
    );

    logger.info('Creating user collection...');

    const { data: collectionId, error } = await createUserCollection(
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

export const deleteUserCollectionAction = withSession(
  async (params: { collectionId: string; csrfToken: string }) => {
    const client = getClient();
    const logger = getLogger();

    const collectionId = params.collectionId;

    logger.info({ collectionId }, `User requested to delete a collection`);

    const { error } = await deleteUserCollectionById(client, collectionId);

    if (error) {
      logger.error(error.message, 'Error deleting user collection');
      throw new Error('Error deleting user collection');
    }

    logger.info({ collectionId }, 'User collection deleted successfully.');

    revalidatePath(configuration.paths.collections);
  },
);

const getUserCollectionSchema = () => {
  return z.object({
    user_id: z.string().min(2),
    name: z.string().min(2),
  });
};
