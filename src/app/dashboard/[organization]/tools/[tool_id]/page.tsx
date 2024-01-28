'use client';

import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';

import GlobalLoadingIndicator from '~/components/GlobalLoadingIndicator';
import ToolBar from './components/ToolBar';
import Playground from './components/Playground';

import useSupabase from '~/core/hooks/use-supabase';
import { getTemplateById } from '~/lib/templates/queries';

import type { IGenerationCopy } from '~/lib/generations/types';
import { useGenerateCopy } from '~/lib/generations/hooks/use-generate-copy';
import { getKeyIf, queryKeys } from '~/lib/query-keys';
import { useUpgradeModal } from '~/core/hooks/use-upgrade-modal';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
import { ToolFormData } from './types';

type ToolPageProps = {
  params: {
    tool_id: string;
  };
};

function ToolPage({ params }: ToolPageProps) {
  const [copies, setCopies] = useState<IGenerationCopy[]>([]);

  const { mutate } = useSWRConfig();

  const client = useSupabase();
  const upgradeModal = useUpgradeModal();
  const organization = useCurrentOrganization();

  const template_id = Number(params.tool_id);

  const key = getKeyIf(queryKeys.templateRetrieve(template_id), !!template_id);
  const { data, error, isLoading } = useSWR(
    key,
    async () =>
      await getTemplateById(client, template_id)
        .throwOnError()
        .then(({ data }) => data),
  );

  const generateCopy = useGenerateCopy();

  if (isLoading) {
    return <GlobalLoadingIndicator />;
  }

  if (error || !data) {
    throw new Error('Template not found!');
  }

  const onSumbitGenerate = async (formValues: ToolFormData) => {
    console.log(formValues);
    const { qty, ...values } = formValues;

    const body = {
      values,
      template_id,
      organization_id: organization.id,
    };

    Array.from({ length: qty }).forEach((_) => {
      generateCopy
        .trigger(body)
        .then((res) => {
          console.log(res);
          mutate(['user-usage']);
          setCopies((prev) => [res as IGenerationCopy, ...prev]);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
          if (err.message === 'No tokens left') {
            upgradeModal.open();
          }
        });
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <ToolBar
        className="md:sticky top-0 flex-1 w-full min-w-[350px] md:max-w-xl"
        data={data}
        onSubmit={onSumbitGenerate}
        isSubmitting={generateCopy.isMutating}
      />
      <div className="flex-[2]">
        <Playground data={copies} />
      </div>
    </div>
  );
}

export default ToolPage;