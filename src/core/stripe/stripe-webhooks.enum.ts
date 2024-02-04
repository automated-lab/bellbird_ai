enum StripeWebhooks {
  AsyncPaymentSuccess = 'checkout.session.async_payment_succeeded',
  Completed = 'checkout.session.completed',
  AsyncPaymentFailed = 'checkout.session.async_payment_failed',
  SubscriptionCreated = 'customer.subscription.created',
  SubscriptionUpdated = 'customer.subscription.updated',
  SubscriptionDeleted = 'customer.subscription.deleted',
}

export default StripeWebhooks;
