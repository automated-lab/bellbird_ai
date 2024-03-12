'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import useSWR from 'swr';

import useSupabase from '~/core/hooks/use-supabase';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import { Progress } from '~/core/ui/progress';

import { useCurrentOrganizationId } from '~/lib/organizations/hooks/use-current-organization-id';
import { getKeyIf, queryKeys } from '~/lib/query-keys';
import { getOrganizationUsageById } from '~/lib/organization_usage/queries';
import { INFINITY_CONSIDERED_TOKENS } from '~/configuration';
import { formatNumber } from '~/core/generic/generic-utils';

const UsageProgress = () => {
  const client = useSupabase();

  const organizationId = useCurrentOrganizationId();

  const key = getKeyIf(
    queryKeys.organizationUsageRetrieve(organizationId),
    !!organizationId,
  );
  const { data, isLoading, error } = useSWR(
    key,
    async () =>
      await getOrganizationUsageById(client, organizationId)
        .throwOnError()
        .then((res) => res.data),
  );

  if (isLoading || error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const generatedTokens = data?.tokens_generated!;
  const tokensLimit = data?.tokens_limit!;

  if (data.tokens_limit >= INFINITY_CONSIDERED_TOKENS) {
    return (
      <div>
        <Tooltip>
          <TooltipTrigger>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              Unlimited Tokens <InformationCircleIcon className="w-4 h-4" />
            </p>
          </TooltipTrigger>
          <TooltipContent>
            Tokens upto {formatNumber(INFINITY_CONSIDERED_TOKENS)} are
            considered unlimited
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="text-nowrap text-sm space-y-2">
      <p>
        {formatNumber(generatedTokens)} / {formatNumber(tokensLimit)} Token
      </p>
      <Progress className="h-3" value={(generatedTokens / tokensLimit) * 100} />
    </div>
  );
};

export default UsageProgress;
