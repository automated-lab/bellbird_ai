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
  return redirect(getAppHomeUrl(params.organization));
}

export default DashboardPage;
