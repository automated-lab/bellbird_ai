import React, { use } from 'react';
import { Metadata } from 'next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import TemplateCard from '~/app/admin/templates/components/TemplateCard';
import AdminHeader from '~/app/admin/components/AdminHeader';
import PagePagination from '~/components/PagePagination';

import {
  ADMIN_NAVIGATION_CONFIG,
  DEFAULT_PAGE_SIZE,
} from '~/app/admin/admin.config';
import getPageFromQueryParams from '~/app/admin/utils/get-page-from-query-param';
import configuration from '~/configuration';
import { getPaginatedTemplates } from '~/lib/templates/queries';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { ITemplate } from '~/lib/templates/types';
import { PageBody } from '~/core/ui/Page';

export const metadata: Metadata = {
  title: `Templates Center | ${configuration.site.siteName}`,
};

type TemplatePageProps = {
  searchParams: {
    page?: string;
  };
};

function TemplatesPage({ searchParams }: TemplatePageProps) {
  const client = getSupabaseServerComponentClient({ admin: true });

  const page = getPageFromQueryParams(searchParams.page);
  const perPage = DEFAULT_PAGE_SIZE;

  const { data, count } = use(getPaginatedTemplates(client, { page, perPage }));
  const pageCount = Math.ceil((count || 1) / perPage);

  return (
    <div className="space-y-6">
      <header>
        <div>
          <Heading type={4}>Welcome to Templates Center, </Heading>

          <p className="text-gray-500 dark:text-gray-400">
            <span>
              Here is the most important page, Modify and Bring up new templates
              to your customers!
            </span>
          </p>
        </div>
      </header>
      <div className="space-y-4">
        <section>
          <Button
            variant="outline"
            href={`${ADMIN_NAVIGATION_CONFIG.templates.path}/create`}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Create New Template
          </Button>
        </section>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((template: ITemplate) => (
            <TemplateCard data={template} key={template.id} />
          ))}
        </section>
        <PagePagination
          path={ADMIN_NAVIGATION_CONFIG.templates.path}
          pageCount={pageCount}
          currentPage={page}
        />
      </div>
    </div>
  );
}

export default TemplatesPage;
