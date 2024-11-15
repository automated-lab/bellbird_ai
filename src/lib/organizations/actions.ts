'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import getLogger from '~/core/logger';
import { withSession } from '~/core/generic/actions-utils';

import { createOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import requireSession from '~/lib/user/require-session';
import { getUserDataById } from '~/lib/server/queries';
import { transferOwnership } from '~/lib/memberships/mutations';
import inviteMembers from '~/lib/server/organizations/invite-members';
import MembershipRole from '~/lib/organizations/types/membership-role';
import {
  getOrganizationByUid,
  getOrganizationInvitedMembers,
  getOrganizationMembers,
} from '~/lib/organizations/database/queries';

import configuration from '~/configuration';
import removeMembership from '~/lib/server/organizations/remove-membership';
import deleteOrganization from '~/lib/server/organizations/delete-organization';
import { MEMBERSHIPS_TABLE } from '~/lib/db-tables';
import { getUserMembershipByOrganization } from '~/lib/memberships/queries';

export const createNewOrganizationAction = withSession(
  async (formData: FormData) => {
    const logger = getLogger();

    const organization = await z
      .string()
      .min(1)
      .max(50)
      .parseAsync(formData.get('organization'));

    const client = getSupabaseServerActionClient();
    const session = await requireSession(client);
    const userId = session.user.id;

    logger.info(
      {
        userId,
        organization,
      },
      `Creating organization...`,
    );

    const { data: organizationUid, error } = await client
      .rpc('create_new_organization', {
        org_name: organization,
        create_user: false,
      })
      .throwOnError()
      .single();

    if (error) {
      return handleError(error, `Error creating organization`);
    }

    logger.info(
      {
        userId,
        organization,
      },
      `Organization successfully created`,
    );

    cookies().set(
      createOrganizationIdCookie({
        userId,
        organizationUid,
      }),
    );

    const redirectPath = [configuration.paths.appPrefix, organizationUid].join(
      '/',
    );

    redirect(redirectPath);
  },
);

export const transferOrganizationOwnershipAction = withSession(
  async (
    params: z.infer<
      ReturnType<typeof getTransferOrganizationOwnershipBodySchema>
    >,
  ) => {
    const result =
      await getTransferOrganizationOwnershipBodySchema().safeParseAsync(params);

    // validate the form data
    if (!result.success) {
      throw new Error(`Invalid form data`);
    }

    const logger = getLogger();
    const client = getSupabaseServerActionClient();

    const targetUserMembershipId = result.data.membershipId;
    const organizationUid = result.data.organizationUid;
    const session = await requireSession(client);

    const currentUserId = session.user.id;
    const currentUser = await getUserDataById(client, currentUserId);

    logger.info(
      {
        organizationUid,
        currentUserId,
        targetUserMembershipId,
      },
      `Transferring organization ownership...`,
    );

    // return early if we can't get the current user
    if (!currentUser) {
      throw new Error(`User is not logged in or does not exist`);
    }

    const { error, data: organization } = await getOrganizationByUid(
      client,
      organizationUid,
    );

    if (error || !organization) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error retrieving organization`,
      );

      throw new Error(`Error retrieving organization`);
    }

    const membership = await getUserMembershipByOrganization(client, {
      organizationUid,
      userId: currentUserId,
    });

    if (!membership) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error retrieving membership`,
      );

      throw new Error(`Error retrieving membership`);
    }

    if (membership.role !== MembershipRole.Owner) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error transferring organization ownership. The user is not the owner of the organization`,
      );

      throw new Error(`Error transferring organization ownership`);
    }

    // transfer ownership to the target user
    const transferOwnershipResponse = await transferOwnership(client, {
      organizationId: organization.id,
      targetUserMembershipId,
    });

    if (transferOwnershipResponse.error) {
      logger.error(
        {
          error,
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error transferring organization ownership`,
      );

      throw new Error(`Error transferring ownership`);
    }

    // all done! we log the result and return a 200
    logger.info(
      {
        organizationUid,
        currentUserId,
        targetUserMembershipId,
      },
      `Ownership successfully transferred to target user`,
    );

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  },
);

export const inviteMembersToOrganizationAction = withSession(
  async (payload: z.infer<ReturnType<typeof getInviteMembersBodySchema>>) => {
    const { invites, organizationUid } =
      await getInviteMembersBodySchema().parseAsync(payload);

    if (!organizationUid) {
      throw new Error(`Organization not found`);
    }

    const logger = getLogger();
    const client = getSupabaseServerActionClient();
    const session = await requireSession(client);
    const inviterId = session.user.id;

    const { data: organization, error: organizationErr } =
      await getOrganizationByUid(client, organizationUid);

    if (organizationErr || !organization) {
      throw new Error(`Organization not found`);
    }

    const { count: membersCount, error: membersErr } =
      await getOrganizationMembers(client, organization.id);

    const { count: invitedMembersCount, error: invitedMembersErr } =
      await getOrganizationInvitedMembers(client, organization.id);

    if (
      membersErr ||
      invitedMembersErr ||
      typeof membersCount !== 'number' ||
      typeof invitedMembersCount !== 'number'
    ) {
      throw new Error(`Error retrieving organization members`);
    }

    if (
      membersCount + invitedMembersCount >=
      organization.subscription?.data.max_users
    ) {
      throw new Error(`Organization has reached the maximum number of users`);
    }

    if (!inviterId) {
      // throw an error when we cannot retrieve the inviter's id or the organization id
      throw new Error(`User is not logged in or does not exist`);
    }

    const adminClient = getSupabaseServerActionClient({ admin: true });

    const params = {
      client,
      adminClient,
      invites,
      organizationUid,
      inviterId,
    };

    try {
      // send requests to invite members
      await inviteMembers(params);

      logger.info(
        {
          organizationUid,
        },
        `Successfully invited members to organization`,
      );
    } catch (e) {
      const message = `Error when inviting user to organization`;

      logger.error(`${message}: ${JSON.stringify(e)}`);

      throw new Error(message);
    }

    const appPrefix = configuration.paths.appPrefix;
    const path = configuration.paths.settings.members;
    const redirectPath = [appPrefix, organizationUid, path].join('/');

    // revalidatePath(redirectPath);
    // redirect(redirectPath);
    return redirectPath;
  },
);

export async function leaveOrganizationAction(data: FormData) {
  const logger = getLogger();
  const client = getSupabaseServerActionClient();
  const { user } = await requireSession(client);

  const id = z.coerce.number().parse(data.get('id'));

  // remove the user from the organization
  const params = {
    organizationId: id,
    userId: user.id,
  };

  await removeMembership(params);

  logger.info(params, `User successfully left organization`);

  // redirect to the app home page
  const redirectPath = configuration.paths.appPrefix;

  revalidatePath('/', 'layout');

  return redirect(redirectPath, RedirectType.replace);
}

export async function deleteOrganizationAction(data: FormData) {
  const client = getSupabaseServerActionClient();
  const { user } = await requireSession(client);
  const logger = getLogger();

  // validate the form data
  const id = z.coerce.number().parse(data.get('id'));

  const userId = user.id;
  const params = { organizationId: id, userId };

  logger.info(params, `User deleting organization...`);

  const membershipResponse = await client
    .from(MEMBERSHIPS_TABLE)
    .select('id, role')
    .eq('organization_id', id)
    .eq('user_id', userId)
    .single();

  if (membershipResponse.error) {
    logger.info(
      { ...params, error: membershipResponse.error },
      `Error deleting organization. The user is not a member of the organization`,
    );

    throw new Error(`Error deleting organization`);
  }

  const role = membershipResponse.data.role;
  const isOwner = role === MembershipRole.Owner;

  if (!isOwner) {
    logger.info(
      params,
      `Error deleting organization. The user is not the owner of the organization`,
    );

    throw new Error(`Error deleting organization`);
  }

  // delete the organization and all its data
  await deleteOrganization(client, {
    organizationId: id,
  });

  revalidatePath('/', 'layout');

  // redirect to the app home page
  return redirect(configuration.paths.appPrefix, RedirectType.replace);
}

function getInviteMembersBodySchema() {
  return z.object({
    organizationUid: z.string().uuid(),
    invites: z.array(
      z.object({
        role: z.nativeEnum(MembershipRole),
        email: z.string().email(),
      }),
    ),
  });
}

function getTransferOrganizationOwnershipBodySchema() {
  return z.object({
    membershipId: z.coerce.number(),
    organizationUid: z.string().uuid(),
  });
}

function handleError<Error = unknown>(
  error: Error,
  message: string,
  organizationId?: string,
) {
  const exception = error instanceof Error ? error.message : undefined;

  getLogger().error(
    {
      exception,
      organizationId,
    },
    message,
  );

  throw new Error(message);
}
