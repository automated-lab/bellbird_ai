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

const logger = getLogger();

export async function POST(req: NextRequest) {
  try {
    logger.info('Generate copy request received');

    const body = await req.json();

    if (!body) {
      logger.error('Body not found');
      throw new Error('Body not found');
    }

    const client = getSupabaseRouteHandlerClient();

    const session = await requireSession(client);
    const user = session.user;

    const organizationId = body.organization_id;

    const {
      data: OrganizationSubscription,
      error: OrganizationSubscriptionErr,
    } = await getSubscriptionByOrganizationId(client, organizationId);

    console.log(OrganizationSubscription);

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
      aiResponse.usage?.completion_tokens ?? 0,
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