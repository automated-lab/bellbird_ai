import type { Stripe } from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import getStripeInstance from '~/core/stripe/get-stripe';
import StripeWebhooks from '~/core/stripe/stripe-webhooks.enum';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import {
  addSubscription,
  deleteSubscription,
  updateSubscriptionById,
} from '~/lib/subscriptions/mutations';

import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { setOrganizationSubscriptionData } from '~/lib/organizations/database/mutations';
import { createOrganizationUsageByPriceId } from '~/lib/user_usage/utils';
import { getOrganizationByUid } from '~/lib/organizations/database/queries';
import { getPlanByPriceId } from '~/lib/stripe/utils';

const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string;

const logger = getLogger();

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export async function POST(request: Request) {
  const signature = headers().get(STRIPE_SIGNATURE_HEADER);

  logger.info(`[Stripe] Received Stripe Webhook`);

  if (!webhookSecretKey) {
    return throwInternalServerErrorException(
      `The variable STRIPE_WEBHOOK_SECRET is unset. Please add the STRIPE_WEBHOOK_SECRET environment variable`,
    );
  }

  // verify signature header is not missing
  if (!signature) {
    return throwBadRequestException();
  }

  const rawBody = await request.text();
  const stripe = await getStripeInstance();

  // create an Admin client to write to the subscriptions table
  const client = getSupabaseRouteHandlerClient({
    admin: true,
  });

  try {
    // build the event from the raw body and signature using Stripe
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecretKey,
    );

    logger.info(
      {
        type: event.type,
      },
      `[Stripe] Processing Stripe Webhook...`,
    );

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case StripeWebhooks.Completed: {
        const subscriptionId = session.subscription as string;

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        console.log(event);

        await onCheckoutCompleted(client, session, subscription);

        break;
      }

      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;

        await deleteSubscription(client, subscription.id);

        break;
      }

      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;

        await updateSubscriptionById(client, subscription);

        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      {
        error,
      },
      `[Stripe] Webhook handling failed`,
    );

    return throwInternalServerErrorException();
  }
}

/**
 * @description When the checkout is completed, we store the order. The
 * subscription is only activated if the order was paid successfully.
 * Otherwise, we have to wait for a further webhook
 */
async function onCheckoutCompleted(
  client: SupabaseClient,
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription,
) {
  const organizationUid = getOrganizationUidFromClientReference(session);
  const customerId = session.customer as string;

  const max_users = getPlanByPriceId(
    subscription.items.data[0].price.id,
  )?.max_users;

  // build organization subscription and set on the organization document
  // we add just enough data in the DB, so we do not query
  // Stripe for every bit of data
  // if you need your DB record to contain further data
  // add it to {@link buildOrganizationSubscription}
  const { error: addSubscriptionErr, data: addSubscriptionData } =
    await addSubscription(client, subscription, max_users);

  if (addSubscriptionErr) {
    logger.error(
      { error: addSubscriptionErr },
      `Failed to add subscription to the database`,
    );

    return Promise.reject(
      `Failed to add subscription to the database: ${addSubscriptionErr.message}`,
    );
  }

  logger.info(
    'Subscription added successfully to the database',
    subscription.id,
  );

  const { data: organization, error: organizationErr } =
    await getOrganizationByUid(client, organizationUid);

  if (!organization || organizationErr) {
    return Promise.reject(
      `Failed to get organization by uid: ${organizationErr?.message}`,
    );
  }

  const organizationId = organization.id;

  const { error: setOrganizationSubscriptionErr } =
    await setOrganizationSubscriptionData(client, {
      organizationId,
      customerId,
      subscriptionId: addSubscriptionData.id,
    });

  if (setOrganizationSubscriptionErr) {
    logger.error(
      { organizationId, error: setOrganizationSubscriptionErr },
      `Failed to set organization subscription data in the database`,
    );

    return Promise.reject(
      `Failed to set organization subscription data in the database: ${setOrganizationSubscriptionErr.message}`,
    );
  }

  logger.info('Organization subscription setted successfully to database');

  const { error: createOrganizationUsageErr } =
    await createOrganizationUsageByPriceId(
      client,
      organizationId,
      subscription.items.data[0].price.id,
    );

  if (createOrganizationUsageErr) {
    logger.error(
      { organizationId, error: createOrganizationUsageErr },
      `Failed to create organization usage record in the database`,
    );

    return Promise.reject(
      `Failed to create organization usage record in the database:  ${createOrganizationUsageErr.message}`,
    );
  }

  return;
}

/**
 * @name getOrganizationUidFromClientReference
 * @description Get the organization UUID from the client reference ID
 * @param session
 */
function getOrganizationUidFromClientReference(
  session: Stripe.Checkout.Session,
) {
  return session.client_reference_id as string;
}
