import Link from 'next/link';

import useUserSession from '~/core/hooks/use-user-session';

import SubscriptionStatusBadge from './SubscriptionStatusBadge';

function HeaderSubscriptionStatusBadge() {
  const user = useUserSession();
  const subscription = user?.data?.subscription;

  console.log(user, subscription);

  // if the organization has an active subscription
  // we do not show the subscription status badge
  if (!subscription) {
    return null;
  }

  const href = `/dashboard/settings/subscription`;

  // in all other cases we show the subscription status badge
  // which will show the subscription status and a link to the subscription page
  return (
    <Link href={href}>
      <SubscriptionStatusBadge subscription={subscription} />
    </Link>
  );
}

export default HeaderSubscriptionStatusBadge;
