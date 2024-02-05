import React, { use } from 'react';
import { Metadata } from 'next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';

import FieldsTable from '~/app/admin/fields/components/FieldsTable';
import getPageFromQueryParams from '~/app/admin/utils/get-page-from-query-param';
import configuration from '~/configuration';
import {
  ADMIN_NAVIGATION_CONFIG,
  DEFAULT_PAGE_SIZE,
} from '~/app/admin/admin.config';
import AdminHeader from '~/app/admin/components/AdminHeader';
import AdminGuard from '~/app/admin/components/AdminGuard';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getPaginatedFields } from '~/lib/fields/queries';

import type { ITemplateField } from '~/lib/fields/types';

interface FieldsAdminPageProps {
  searchParams: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: `Fields | ${configuration.site.siteName}`,
};

function FieldsPage({ searchParams }: FieldsAdminPageProps) {
  const page = getPageFromQueryParams(searchParams.page);
  const perPage = DEFAULT_PAGE_SIZE;

  const { fields, count } = use(loadFields(page, perPage));

  const pageCount = Math.ceil((count || 1) / perPage);

  return (
    <div className="space-y-6">
      <header>
        <div>
          <Heading type={4}>Welcome to Fields Center, </Heading>

          <p className="text-gray-500 dark:text-gray-400">
            <span>Here are all the fields to use in your templates</span>
          </p>
        </div>
      </header>
      <div className="space-y-4">
        <section>
          <Button
            variant="outline"
            href={`${ADMIN_NAVIGATION_CONFIG.fields.path}/create`}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Create New Field
          </Button>
        </section>
        <section>
          <FieldsTable
            fields={fields}
            page={page}
            perPage={perPage}
            pageCount={pageCount}
          />
        </section>
      </div>
    </div>
  );
}

export default AdminGuard(FieldsPage);

const loadFields = async (page: number, perPage: number) => {
  const client = getSupabaseServerComponentClient({ admin: true });
  const { data, count, error } = await getPaginatedFields(client, {
    page,
    perPage,
  });

  const fields: ITemplateField[] = data || [];

  if (error) {
    throw error;
  }

  return {
    fields,
    count,
  };
};
