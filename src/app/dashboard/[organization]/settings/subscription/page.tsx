import Trans from '~/core/ui/Trans';

import PlansStatusAlertContainer from './components/PlanStatusAlertContainer';
import PlansContainer from '~/app/dashboard/subscribe/[organization]/components/PlansContainer';
import UsageProgress from '~/components/UsageProgress';
import Heading from '~/core/ui/Heading';

import { withI18n } from '~/i18n/with-i18n';
import { Card } from '~/core/ui/Card';

export const metadata = {
  title: 'Subscription',
};

const SubscriptionSettingsPage = () => {
  return (
    <div className={'flex flex-col space-y-4 w-full'}>
      <div className={'flex flex-col px-2 space-y-1'}>
        <Heading type={4}>
          <Trans i18nKey={'common:subscriptionSettingsTabLabel'} />
        </Heading>

        <span className={'text-gray-500 dark:text-gray-400'}>
          <Trans i18nKey={'subscription:subscriptionTabSubheading'} />
        </span>
      </div>

      <div className="!mb-4">
        <PlansStatusAlertContainer />

        <PlansContainer />
      </div>

      <Card className="p-4 space-y-4">
        <Heading type={5}>Token Usage</Heading>

        <UsageProgress />
      </Card>
    </div>
  );
};

export default withI18n(SubscriptionSettingsPage);
