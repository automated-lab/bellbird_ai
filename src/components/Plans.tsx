'use client';

import If from '~/core/ui/If';
import Trans from '~/core/ui/Trans';
import SubscriptionCard from '~/app/dashboard/[organization]/settings/subscription/components/SubscriptionCard';
import PlanSelectionForm from '~/app/dashboard/[organization]/settings/subscription/components/PlanSelectionForm';
import BillingPortalRedirectButton from '~/app/dashboard/[organization]/settings/subscription/components/BillingRedirectButton';

import type Organization from '~/lib/organizations/types/organization';
import type { OrganizationSubscription } from '~/lib/organizations/types/organization-subscription';

const Plans = ({
  organization,
}: {
  organization: Organization & {
    subscription: {
      customerId: Maybe<string>;
      data: OrganizationSubscription;
    };
  };
}) => {
  if (!organization) {
    return null;
  }

  const subscription = organization.subscription?.data;
  const customerId = organization.subscription?.customerId;

  if (!subscription) {
    return (
      <PlanSelectionForm organization={organization} customerId={customerId} />
    );
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <SubscriptionCard subscription={subscription} />

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
