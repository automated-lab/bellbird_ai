'use client';

import React from 'react';
import useSWR from 'swr';

import Heading from '~/core/ui/Heading';
import Loading from '~/components/Loading';
import PagePagination from '~/components/PagePagination';
import ToolCard from './components/ToolCard';

import useUserSession from '~/core/hooks/use-user-session';
import useSupabase from '~/core/hooks/use-supabase';
import getPageFromQueryParams from '~/app/admin/utils/get-page-from-query-param';
import { DEFAULT_PAGE_SIZE } from '~/app/admin/admin.config';
import { getPaginatedTemplates } from '~/lib/templates/queries';
import { getKeyIf, queryKeys } from '~/lib/query-keys';
import configuration from '~/configuration';

interface ToolsPageProps {
  searchParams: {
    page?: string;
  };
}

function ToolsPage({ searchParams }: ToolsPageProps) {
  const session = useUserSession();
  const client = useSupabase();

  const page = Number(getPageFromQueryParams(searchParams.page));
  const perPage = DEFAULT_PAGE_SIZE;

  const key = getKeyIf(queryKeys.templateList(page, perPage), !!session);
  const { data, error, isLoading } = useSWR(
    key,
    async () =>
      await getPaginatedTemplates(client, { page, perPage })
        .throwOnError()
        .then(({ data, count }) => ({ data, count })),
  );

  const pageCount = Math.ceil((data?.count || 1) / perPage);

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-6">
      <header>
        <Heading type={4}>Welcome to Charm&apos;s AI marketing tools!</Heading>

        <p className="text-gray-500 dark:text-gray-400">
          <span>What will you create today?</span>
        </p>
      </header>

      <section className="w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data?.map((template, index) => (
              <ToolCard data={template} key={index} />
            ))}
          </div>
        )}
      </section>

      <PagePagination
        currentPage={page}
        pageCount={pageCount}
        path={configuration.paths.tools}
      />
    </div>
  );
}

export default ToolsPage;
