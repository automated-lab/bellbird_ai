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

const logger = getLogger();

interface Body {
  secret: string;
  email: string;
  plan: string;
  duration_in_months: string | number;
}

const getAdminClient = () => getSupabaseRouteHandlerClient({ admin: true });

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
      logger.error({ getAppIdErr, appId }, 'Invalid Secret');
      return throwUnauthorizedException('Invalid secret!');
    }

    logger.info('App id retrieved', appId);

    const { data: app, error: getAppErr } = await getApp(client, appId);

    if (!app || getAppErr) {
      logger.error({ appId, getAppErr }, 'App not found');
      return throwUnauthorizedException();
    }

    const password = generatePassword(8);

    const { data: userData, error: createUserErr } =
      await client.auth.admin.createUser({
        email: email,
        password: password,
      });

    if (!userData || createUserErr) {
      logger.error({ email }, 'Failed to create user');
      return throwInternalServerErrorException(
        `Failed to create user, An account with email : ${email} may exist`,
      );
    }

    logger.info('User created successfully', email);

    const payload = {
      client,
      organizationName: DEFAULT_ORG_NAME,
      userId: userData.user.id,
    };

    const { data: organizationUid, error: enrollUserErr } =
      await enrollUserWithNewOrg(payload);

    if (!organizationUid || enrollUserErr) {
      logger.error({ email, enrollUserErr }, 'Failed to enroll user');
      await client.auth.admin.deleteUser(userData.user.id);
      logger.info({ email }, 'User deleted');
      return throwInternalServerErrorException('Failed to onboard user');
    }

    logger.info('User onboarded successfully', email);

    const stripe = await getStripeInstance();

    const priceId = configuration.stripe.products
      .find((product) => product.name.toLowerCase() === plan.toLowerCase())
      ?.plans.find((p) => p.name === 'Monthly')?.stripePriceId;

    const stripeCoupon = await stripe.coupons.create({
      percent_off: 100,
      duration: 'repeating',
      duration_in_months: Number(duration_in_months),
    });

    logger.info('Coupon created successfully', email);

    const customer = await stripe.customers.create({
      email: email,
    });

    logger.info('Customer created successfully', email);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      coupon: stripeCoupon.id,
      metadata: {
        organization_uid: organizationUid,
      },
      cancel_at: dayjs().add(Number(duration_in_months), 'month').unix(),
    });

    logger.info('Subscription created successfully', email);

    console.log(subscription);

    // send email
    try {
      await sendEnrollmentEmail({
        invitedUserEmail: email,
        plan: plan,
        temporaryPassword: password,
      });
    } catch (error) {
      console.log(error);
      logger.error({ error }, 'Failed to send enrollment email');
      return throwInternalServerErrorException(
        `Failed to send enrollment email to ${email}`,
      );
    }

    return NextResponse.json(
      {
        message: `User created with id ${userData.user.id}, email ${email} and a password ${password} and plan ${plan}`,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return throwInternalServerErrorException();
  }
}

async function sendEnrollmentEmail(props: {
  plan: string;
  temporaryPassword: string;
  invitedUserEmail: string;
}) {
  const { invitedUserEmail, plan, temporaryPassword } = props;

  const { default: renderEnrollmentEmail } = await import(
    '~/lib/emails/enrolled-user'
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
    temporaryPassword,
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

/** 
 Function to generate a random password
*/
function generatePassword(length: number) {
  var chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var passwordLength = length || 8;
  var password = '';

  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
}
