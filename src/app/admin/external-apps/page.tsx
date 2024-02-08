import React, { use } from 'react';
import { Metadata } from 'next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';

import getPageFromQueryParams from '~/app/admin/utils/get-page-from-query-param';
import { DEFAULT_PAGE_SIZE } from '~/app/admin/admin.config';
import AdminGuard from '~/app/admin/components/AdminGuard';
import AppsTable from './components/AppsTable';
import { CreateAppModal } from './components/CreateAppModal';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getPaginatedApps } from '~/lib/external-apps/queries';
import configuration from '~/configuration';

interface ExternalAppsAdminPageProps {
  searchParams: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: `Apps | ${configuration.site.siteName}`,
};

function ExternalAppsPage({ searchParams }: ExternalAppsAdminPageProps) {
  const page = getPageFromQueryParams(searchParams.page);
  const perPage = DEFAULT_PAGE_SIZE;

  const { apps, count } = use(loadApps(page, perPage));

  const pageCount = Math.ceil((count || 1) / perPage);

  return (
    <div className="space-y-6">
      <header>
        <div>
          <Heading type={4}>Welcome to External Apps </Heading>

          <p className="text-gray-500 dark:text-gray-400">
            <span>
              Here you can create external apps and sell subscriptions with your
              other products
            </span>
          </p>
        </div>
      </header>
      <div className="space-y-4">
        <section>
          <CreateAppModal>
            <Button variant="outline" className="ml-auto">
              <PlusCircleIcon className="w-5 h-5 mr-2" /> Create New App
            </Button>
          </CreateAppModal>
        </section>
        <section>
          <AppsTable
            apps={apps}
            page={page}
            perPage={perPage}
            pageCount={pageCount}
          />
        </section>
      </div>
    </div>
  );
}

export default AdminGuard(ExternalAppsPage);

const loadApps = async (page: number, perPage: number) => {
  const client = getSupabaseServerComponentClient({ admin: true });
  const { data, count, error } = await getPaginatedApps(client, {
    page,
    perPage,
  });

  const apps = data || [];

  if (error) {
    throw error;
  }

  return {
    apps,
    count,
  };
};
