import { redirect } from 'next/navigation';
import { getAppHomeUrl } from '~/navigation.config';

export const metadata = {
  title: 'Dashboard',
};

interface DashboardPageProps {
  params: {
    organization: string;
  };
}

function DashboardPage({ params }: DashboardPageProps) {
  redirect(getAppHomeUrl(params.organization));

  return null;
}

export default DashboardPage;
