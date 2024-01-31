import { redirect } from 'next/navigation';

import Plans from '~/components/Plans';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getSubscriptionByOrganizationId } from '~/lib/subscriptions/queries';
import requireSession from '~/lib/user/require-session';

import configuration from '~/configuration';
import PlansStatusAlertContainer from '~/app/dashboard/[organization]/settings/subscription/components/PlanStatusAlertContainer';
import { getOrganizationsByUserId } from '~/lib/organizations/database/queries';
import MembershipRole from '~/lib/organizations/types/membership-role';
import { getAppHomeUrl } from '~/navigation.config';

export const metadata = {
  title: 'Subscription',
};

async function SubscriptionPage() {
  const client = getSupabaseServerComponentClient();

  const { user } = await requireSession(client);

  const { data: userMemberships, error: userMembershipsErr } =
    await getOrganizationsByUserId(client, user.id);

  const userOwnedOrganization = userMemberships?.find(
    (membership) => membership.role === MembershipRole.Owner,
  );

  if (!userOwnedOrganization || userMembershipsErr) {
    return redirect(configuration.paths.onboarding);
  }

  const { data: organizationSubscription } =
    await getSubscriptionByOrganizationId(
      client,
      userOwnedOrganization?.organization.id,
    );

  if (organizationSubscription) {
    return redirect(getAppHomeUrl(userOwnedOrganization.organization.uuid));
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <PlansStatusAlertContainer />

      <Plans organization={userOwnedOrganization.organization} />
    </div>
  );
}

export default SubscriptionPage;
