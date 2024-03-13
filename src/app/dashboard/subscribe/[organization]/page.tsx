import { redirect } from 'next/navigation';

import Plans from '~/components/Plans';
import PlansStatusAlertContainer from '~/app/dashboard/[organization]/settings/subscription/components/PlanStatusAlertContainer';
import { UserSessionProvider } from './components/UserSessionProvider';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import requireSession from '~/lib/user/require-session';
import MembershipRole from '~/lib/organizations/types/membership-role';
import loadSubscribeData from '~/lib/server/loaders/load-subscribe-data';
import getCurrentOrganization from '~/lib/server/organizations/get-current-organization';

import configuration from '~/configuration';
import { isActiveSubscription } from '~/lib/stripe/utils';
import { getAppHomeUrl } from '~/navigation.config';

export const metadata = {
  title: 'Subscription',
};

async function SubscriptionPage({
  params,
}: {
  params: {
    organization: string;
  };
}) {
  const client = getSupabaseServerComponentClient();

  const { user } = await requireSession(client);
  const organizationUid = params.organization;

  const { organization, role } = await getCurrentOrganization({
    organizationUid,
    userId: user.id,
  });

  if (!organization || role !== MembershipRole.Owner) {
    return redirect(configuration.paths.appPrefix);
  }

  if (isActiveSubscription(organization.subscription?.data?.status)) {
    return redirect(getAppHomeUrl(organizationUid));
  }

  const data = await loadSubscribeData(organization.uuid);

  return (
    <UserSessionProvider data={data}>
      <div className={'flex flex-col space-y-4'}>
        <PlansStatusAlertContainer />

        <Plans organization={organization} />
      </div>
    </UserSessionProvider>
  );
}

export default SubscriptionPage;
