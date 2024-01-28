import { redirect } from 'next/navigation';

import Plans from '~/components/Plans';
import PlansStatusAlertContainer from '~/app/dashboard/settings/subscription/components/PlanStatusAlertContainer';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getSubscriptionByUserId } from '~/lib/subscriptions/queries';
import requireSession from '~/lib/user/require-session';

import configuration from '~/configuration';

export const metadata = {
  title: 'Subscription',
};

async function SubscriptionPage() {
  const client = getSupabaseServerComponentClient();

  const { user } = await requireSession(client);

  const { data: userSubscription } = await getSubscriptionByUserId(
    client,
    user.id,
  );

  if (userSubscription) {
    return redirect(configuration.paths.appHome);
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <PlansStatusAlertContainer />

      <Plans client={client} />
    </div>
  );
}

export default SubscriptionPage;
