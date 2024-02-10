import loadAppData from '~/lib/server/loaders/load-app-data';
import AppRouteShell from '~/app/dashboard/[organization]/components/OrganizationScopeLayout';

async function AppLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: {
    organization: string;
  };
}>) {
  const data = await loadAppData(params.organization);

  console.log('is there something wrong on the main app layout');

  return <AppRouteShell data={data}>{children}</AppRouteShell>;
}

export default AppLayout;
