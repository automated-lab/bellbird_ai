import AdminHeader from '~/app/admin/components/AdminHeader';
import AdminGuard from '~/app/admin/components/AdminGuard';
import OrganizationsTable from '~/app/admin/workspaces/components/OrganizationsTable';
import { getOrganizations } from '~/app/admin/workspaces/queries';
import getPageFromQueryParams from '~/app/admin/utils/get-page-from-query-param';

import { TextFieldInput } from '~/core/ui/TextField';
import { PageBody } from '~/core/ui/Page';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';

import configuration from '~/configuration';

interface OrganizationsAdminPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export const metadata = {
  title: `Workspaces | ${configuration.site.siteName}`,
};

async function OrganizationsAdminPage({
  searchParams,
}: OrganizationsAdminPageProps) {
  const page = getPageFromQueryParams(searchParams.page);
  const client = getSupabaseServerComponentClient({ admin: true });
  const perPage = 10;
  const search = searchParams.search || '';

  const { organizations, count } = await getOrganizations(
    client,
    search,
    page,
    perPage,
  );

  const pageCount = count ? Math.ceil(count / perPage) : 0;

  return (
    <div className={'flex flex-1 flex-col'}>
      <AdminHeader>Manage Workspaces</AdminHeader>

      <PageBody>
        <div className={'flex flex-col space-y-4'}>
          <form method={'GET'}>
            <TextFieldInput
              name={'search'}
              defaultValue={search}
              placeholder={'Search Workspaces...'}
            />
          </form>

          <OrganizationsTable
            perPage={perPage}
            page={page}
            pageCount={pageCount}
            organizations={organizations}
          />
        </div>
      </PageBody>
    </div>
  );
}

export default AdminGuard(OrganizationsAdminPage);
