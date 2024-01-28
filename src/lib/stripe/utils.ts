enum StripeSubscriptionStatus {
  Active = 'active',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Unpaid = 'unpaid',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  Trialing = 'trialing',
}

const ACTIVE_SUBSCRIPTION_STATUSES = [
  StripeSubscriptionStatus.Active,
  StripeSubscriptionStatus.Trialing,
];

// Check if a subscription update is a renewal
export const isRenewal = (
  previousAttributes:
    | {
        current_period_start?: number;
        current_period_end?: number;
      }
    | undefined,
) => {
  if (
    previousAttributes?.current_period_start ||
    previousAttributes?.current_period_end
  ) {
    return true;
  }

  return false;
};

// Check if a subscription is active
export const isActiveSubscription = (status?: string) => {
  if (!status) return false;

  return ACTIVE_SUBSCRIPTION_STATUSES.includes(
    status as StripeSubscriptionStatus,
  );
};
