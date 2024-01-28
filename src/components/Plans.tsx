import If from '~/core/ui/If';
import Trans from '~/core/ui/Trans';
import { SupabaseClient } from '@supabase/supabase-js';

import PlanSelectionForm from '~/app/dashboard/settings/subscription/components/PlanSelectionForm';
import BillingPortalRedirectButton from '~/app/dashboard/settings/subscription/components/BillingRedirectButton';

import SubscriptionCard from '../app/dashboard/settings/subscription/components/SubscriptionCard';
import { Subscription } from '~/lib/subscriptions/types';
import { getUserById } from '~/lib/user/database/queries';
import requireSession from '~/lib/user/require-session';

const Plans: React.FC<{ client: SupabaseClient }> = async ({ client }) => {
  const { user } = await requireSession(client);
  const userId = user?.id;

  if (!userId) {
    return null;
  }

  const { data: userData, error: userDataErr } = await getUserById(
    client,
    userId,
  );

  if (userDataErr || !userData) {
    return null;
  }

  const { subscription, customerId } = userData;

  if (!subscription) {
    return <PlanSelectionForm customerId={customerId} userId={userId} />;
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <SubscriptionCard subscription={subscription as Subscription} />

      <If condition={customerId}>
        <div className={'flex flex-col space-y-2'}>
          <BillingPortalRedirectButton customerId={customerId as string}>
            <Trans i18nKey={'subscription:manageBilling'} />
          </BillingPortalRedirectButton>

          <span className={'text-xs text-gray-500 dark:text-gray-400'}>
            <Trans i18nKey={'subscription:manageBillingDescription'} />
          </span>
        </div>
      </If>
    </div>
  );
};

export default Plans;
