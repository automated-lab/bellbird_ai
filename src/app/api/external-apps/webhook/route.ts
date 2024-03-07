import dayjs from 'dayjs';
import {
  throwBadRequestException,
  throwInternalServerErrorException,
  throwUnauthorizedException,
} from '~/core/http-exceptions';
import getLogger from '~/core/logger';
import getStripeInstance from '~/core/stripe/get-stripe';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { getApp } from '~/lib/external-apps/queries';
import { getAppIdBySecret } from '~/lib/secrets/queries';
import enrollUserWithNewOrg from '~/lib/server/user/enroll-user-with-new-org';
import configuration, { DEFAULT_ORG_NAME } from '~/configuration';
import sendEmail from '~/core/email/send-email';
import { NextResponse } from 'next/server';
import { getUserIdByEmail } from '~/lib/server/queries';

import crypto from 'crypto';

const logger = getLogger();

interface Body {
  secret: string;
  email: string;
  plan: string;
  duration_in_months: string | number;
}

const getAdminClient = () => getSupabaseRouteHandlerClient({ admin: true });

function generatePassword(length: number): string {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz@ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    password += chars[randomIndex];
  }

  return password;
}

async function sendEnrollmentEmail(props: {
  plan: string;
  temporaryPassword: string | null;
  invitedUserEmail: string;
  isNewUser: boolean;
}) {
  const { invitedUserEmail, plan, temporaryPassword, isNewUser } = props;
  const { default: renderEnrollmentEmail } = await import(
    `~/lib/emails/${isNewUser ? 'enrolled-user' : 'enrolled-existing-user'}`
  );
  const sender = process.env.EMAIL_SENDER;
  const productName = configuration.site.siteName;

  if (!sender) {
    return Promise.reject(
      `Missing email configuration. Please add the following environment variables:
      EMAIL_SENDER
      `,
    );
  }

  const subject = `You've been invited to ${productName}`;

  const siteUrl = configuration.site.siteUrl;

  assertSiteUrl(siteUrl);

  const appUrl = new URL(siteUrl).href;

  const html = renderEnrollmentEmail({
    productName,
    appUrl,
    invitedUserEmail,
    plan,
    temporaryPassword: isNewUser ? temporaryPassword : undefined,
  });

  return sendEmail({
    to: invitedUserEmail,
    from: sender,
    subject,
    html,
  });
}

function assertSiteUrl(siteUrl: Maybe<string>): asserts siteUrl is string {
  if (!siteUrl && configuration.production) {
    throw new Error(
      `Please configure the "siteUrl" property in the configuration file ~/configuration.ts`,
    );
  }
}

async function createSubscription(props: {
  email: string;
  plan: string;
  duration_in_months: string | number;
  organizationUid: string;
}) {
  const { email, plan, duration_in_months, organizationUid } = props;
  const durationInMonths = Number(duration_in_months);

  const stripe = await getStripeInstance();

  const priceId = configuration.stripe.products
    .find((product) => product.name.toLowerCase() === plan.toLowerCase())
    ?.plans.find((p) => p.name === 'Monthly')?.stripePriceId;

  if (!priceId) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: 'repeating',
    duration_in_months: durationInMonths,
  });

  const customer = await stripe.customers.create({ email });
  const cancelAt = dayjs().add(durationInMonths, 'month').unix();

  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    coupon: coupon.id,
    metadata: { organization_uid: organizationUid },
    cancel_at: cancelAt,
  });
}

export async function POST(request: Request) {
  try {
    logger.info('External App request received');

    const body: Body = await request.json();
    const { secret, email, plan, duration_in_months } = body;

    if (!secret) {
      return throwBadRequestException('Missing secret');
    }

    logger.info('Secret retrieved', email);

    const client = getAdminClient();

    const { data: appId, error: getAppIdErr } = await getAppIdBySecret(
      client,
      secret,
    );

    if (!appId || getAppIdErr) {
      logger.error('Invalid Secret');
      return throwUnauthorizedException('Invalid secret!');
    }

    logger.info('App id retrieved', appId);

    const { data: app, error: getAppErr } = await getApp(client, appId);

    if (!app || getAppErr) {
      logger.error('App not found');
      return throwUnauthorizedException();
    }

    const { data: existingUserId, error: getUserIdErr } =
      await getUserIdByEmail(client, email);

    if (getUserIdErr) {
      logger.error('Failed to check if user exists', getUserIdErr);
      return throwInternalServerErrorException(
        'Failed to check if user exists',
      );
    }

    console.log(existingUserId);

    let userId = existingUserId;
    const isNewUser = !existingUserId;

    let password = null;

    if (isNewUser) {
      password = generatePassword(8);

      const { data: userData, error } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (!userData || error) {
        logger.error('Failed to create userData');
        return throwInternalServerErrorException(
          `Failed to create user, An account with email : ${email} may exist`,
        );
      }

      logger.info('User created successfully', email);

      userId = userData.user.id;
    }

    const payload = {
      client,
      organizationName: DEFAULT_ORG_NAME,
      userId,
      create_user: isNewUser,
    };

    const { data: organizationUid, error: enrollUserErr } =
      await enrollUserWithNewOrg(payload);

    if (!organizationUid || enrollUserErr) {
      logger.error('Failed to enroll user', enrollUserErr);
      if (isNewUser) await client.auth.admin.deleteUser(userId);
      logger.info('User deleted');
      return throwInternalServerErrorException('Failed to onboard user');
    }

    logger.info('User onboarded successfully', email);

    await createSubscription({
      email,
      plan,
      duration_in_months,
      organizationUid,
    });

    logger.info('Subscription created successfully', email);

    try {
      await sendEnrollmentEmail({
        invitedUserEmail: email,
        plan,
        temporaryPassword: password,
        isNewUser,
      });
    } catch (error) {
      logger.error('Failed to send enrollment email', error);
      return throwInternalServerErrorException(
        `Failed to send enrollment email to ${email}`,
      );
    }

    return NextResponse.json(
      {
        message: isNewUser
          ? `User created with id ${userId}, email ${email} and a password ${password} and plan ${plan}`
          : `User with id ${userId} has been enrolled successfully with a ${plan} plan`,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    logger.error({ error }, 'Unhandled error');
    return throwInternalServerErrorException();
  }
}
