import { NextRequest, NextResponse } from 'next/server';
import getLogger from '~/core/logger';

import { renderPromptWithVariables } from '~/lib/generations/utils';
import { sendPrompt } from '~/lib/openai';
import { incrementOrganizationGeneratedTokens } from '~/lib/user_usage/mutations';
import { getTemplatePrompt } from '~/lib/templates/queries';
import { getOrganizationRemainingTokens } from '~/lib/user_usage/queries';
import requireSession from '~/lib/user/require-session';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { IGenerationCopy } from '~/lib/generations/types';
import { getSubscriptionByOrganizationId } from '~/lib/subscriptions/queries';
// import { getSubscriptionByUserId } from '~/lib/subscriptions/queries';
import { isActiveSubscription } from '~/lib/stripe/utils';
import getCurrentOrganization from '~/lib/server/organizations/get-current-organization';
import {
  getUserMembershipByOrganization,
  getUserRoleByMembershipId,
} from '~/lib/memberships/queries';

export interface GenerateCopyBody {
  values: Record<string, string | string[]>;
  template_id: string;
  organization_uid: string;
}

const logger = getLogger();

export async function POST(req: NextRequest) {
  try {
    logger.info('Generate copy request received');

    const body: GenerateCopyBody = await req.json();

    if (!body) {
      logger.error('Body not found');
      throw new Error('Body not found');
    }

    const client = getSupabaseRouteHandlerClient();

    const session = await requireSession(client);
    const user = session.user;

    const userMembership = await getUserMembershipByOrganization(client, {
      userId: user.id,
      organizationUid: body.organization_uid,
    });

    logger.info('User membership retrieved', user.id, userMembership.id);

    const organizationId = userMembership.organizationId;

    const {
      data: OrganizationSubscription,
      error: OrganizationSubscriptionErr,
    } = await getSubscriptionByOrganizationId(client, organizationId);

    if (
      !OrganizationSubscription ||
      !isActiveSubscription(OrganizationSubscription.status)
    ) {
      logger.error(
        { error: OrganizationSubscriptionErr },
        'User is not subscribed to a plan',
      );

      throw NextResponse.json(
        { message: "You've no Active Plan" },
        { status: 402 },
      );
    }

    logger.info('User Organization is subscribed to a plan');

    const remainingTokens = await getOrganizationRemainingTokens(
      client,
      organizationId,
    );

    if (remainingTokens <= 0) {
      logger.error('User has no tokens left');
      return NextResponse.json({ message: 'No tokens left' }, { status: 402 });
    }

    logger.info('User has enough tokens', user.id, remainingTokens);

    const { data: template, error: templateErr } = await getTemplatePrompt(
      client,
      body.template_id,
    );

    if (templateErr || !template) {
      logger.error(
        { error: templateErr },
        'Template not found!',
        body.template_id,
      );
      throw new Error('Template not found!');
    }

    const prompt = renderPromptWithVariables(template.prompt, body.values);

    logger.info('Prompt has been prepared', prompt);

    const { data: aiResponse, error: aiResponseErr } = await sendPrompt(
      prompt,
      remainingTokens,
    );

    if (aiResponseErr || !aiResponse) {
      logger.error({ error: aiResponseErr }, 'Failed to generate text');
      throw new Error('Failed to generate text');
    }

    logger.info('text generated successfully');

    await incrementOrganizationGeneratedTokens(
      client,
      organizationId,
      aiResponse.usage?.total_tokens ?? 0,
    );

    logger.info('User tokens incremented successfully', user.id);

    const generation = {
      openai_id: aiResponse.id,
      content: aiResponse.choices[0].message.content,
      user_id: user.id,
      organization_id: organizationId,
      template_id: body.template_id,
    } as IGenerationCopy;

    console.log(
      generation.content,
      generation.content.split(' ').length,
      aiResponse.usage?.completion_tokens,
    );

    return NextResponse.json(generation, { status: 200 });
  } catch (error) {
    logger.error({ error }, 'Error generating copy');

    return NextResponse.json(
      { message: 'An error has been occured, Please try again later!' },
      { status: 500 },
    );
  }
}
