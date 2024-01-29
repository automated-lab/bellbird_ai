'use client';

import React from 'react';
import useSWR from 'swr';

import useSupabase from '~/core/hooks/use-supabase';
import { Progress } from '~/core/ui/progress';
import { useCurrentOrganizationId } from '~/lib/organizations/hooks/use-current-organization-id';

import { getKeyIf, queryKeys } from '~/lib/query-keys';
import { getOrganizationUsageById } from '~/lib/user_usage/queries';

type Props = {};

const UsageProgress = (props: Props) => {
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

  console.log(data, error);

  if (isLoading || error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const generatedTokens = data?.tokens_generated!;
  const tokensLimit = data?.tokens_limit!;

  if (data.tokens_limit === Infinity) {
    return null;
  }

  return (
    <div className="text-sm  mb-4 space-y-2">
      <p>
        {generatedTokens} / {tokensLimit} Token
      </p>
      <Progress className="h-3" value={(generatedTokens / tokensLimit) * 100} />
    </div>
  );
};

export default UsageProgress;
