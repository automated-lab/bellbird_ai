'use server';
import { permanentRedirect } from 'next/navigation';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import { withSession } from '~/core/generic/actions-utils';
import getLogger from '~/core/logger';

import requireSession from '~/lib/user/require-session';
import { getTemplatePrompt } from '~/lib/templates/queries';
import { getUserRemainingTokens } from '~/lib/user_usage/queries';
import { incrementUserGeneratedTokens } from '~/lib/user_usage/mutations';
import { sendPrompt } from '~/lib/openai';

import { renderPromptWithVariables } from './utils';

import type {
  IGenerationCopy,
  IGenerationCopyDraft,
} from '~/lib/generations/types';

const getClient = () => getSupabaseServerActionClient();

export const generateCopies = withSession(
  async ({
    body,
    csrfToken,
  }: {
    body: IGenerationCopyDraft;
    csrfToken: string;
  }) => {
    console.log('we are here!');

    const logger = getLogger();

    const client = getClient();
    const session = await requireSession(client);

    const user = session.user;

    const remaining_tokens = await getUserRemainingTokens(client, user.id);

    if (remaining_tokens <= 0) {
      logger.error('User has no remaining tokens!');
      return redirectToUpgradeModal();
    }

    const { data: template, error } = await getTemplatePrompt(
      client,
      body.template_id,
    );

    if (error) {
      logger.error('Template not found!');
      throw new Error('Template not found! Please try again!');
    }

    // replace prompt variables with user values
    const prompt = renderPromptWithVariables(template.prompt, body.values);

    console.log(prompt);
    const { data: copyData, error: copyError } = await sendPrompt(
      prompt,
      remaining_tokens,
    );

    if (copyError) {
      logger.error(copyError, 'Error while generating copy');
      throw new Error('Error generating copy!');
    }

    console.log(
      copyData?.usage?.prompt_tokens,
      copyData?.usage?.completion_tokens,
      copyData?.usage?.total_tokens,
    );

    const newGeneratedTokens = copyData?.usage?.total_tokens ?? 0;
    await incrementUserGeneratedTokens(client, user.id, newGeneratedTokens);

    return {
      openai_id: copyData?.id,
      content: copyData?.choices[0].message.content,
      user_id: user.id,
      template_id: body.template_id,
    } as IGenerationCopy;
  },
);

const redirectToUpgradeModal = () => {
  return permanentRedirect('/dashboard/upgrade');
};
