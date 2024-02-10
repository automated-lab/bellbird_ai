import type { Provider } from '@supabase/gotrue-js';
import { StripeCheckoutDisplayMode } from '~/lib/stripe/types';

const production = process.env.NODE_ENV === 'production';

enum Themes {
  Light = 'light',
  Dark = 'dark',
}

export const DEFAULT_ORG_NAME = 'My Workspace';

const configuration = {
  site: {
    name: 'Charm App',
    description: 'Your best copywriter',
    themeColor: '#00B0DA',
    themeColorDark: '#0a0a0a',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Charm App',
    twitterHandle: '',
    githubHandle: '',
    convertKitFormId: '',
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  auth: {
    // ensure this is the same as your Supabase project. By default - it's true
    requireEmailConfirmation:
      process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION === 'true',
    // NB: Enable the providers below in the Supabase Console
    // in your production project
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      emailOtp: false,
      oAuth: [] as Provider[],
    },
  },
  production,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  theme: Themes.Light,
  features: {
    enableThemeSwitcher: true,
    enableAccountDeletion: getBoolean(
      process.env.NEXT_PUBLIC_ENABLE_ACCOUNT_DELETION,
      false,
    ),
    enableOrganizationDeletion: false,
  },
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signInMfa: '/auth/verify',
    onboarding: `/onboarding`,
    subscribe: '/dashboard/subscribe',
    appPrefix: '/dashboard',
    appHome: 'tools',
    authCallback: '/auth/callback',
    tools: '/tools',
    tool: (id: string) => `/tools/${id}`,
    collections: '/my-collections',
    settings: {
      profile: 'settings/profile',
      subscription: 'settings/subscription',
      workspace: 'settings/workspace',
      members: 'settings/workspace/members',
      authentication: 'settings/profile/authentication',
      email: 'settings/profile/email',
      password: 'settings/profile/password',
    },
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  stripe: {
    embedded: true,
    displayMode: StripeCheckoutDisplayMode.Popup,
    products: [
      {
        name: 'Basic',
        description: 'Description of your Basic plan',
        features: ['access to all tools'],
        plans: [
          {
            name: 'Monthly',
            price: '$5',
            tokens_limit: 50000,
            max_users: 1,
            stripePriceId: 'price_1OKR3gGWvJkW2hKDp42NylVR',
          },
        ],
      },
      {
        name: 'Pro',
        badge: `Most Popular`,
        recommended: true,
        description: 'Description of your Pro plan',
        features: ['access to all tools', '2 team members'],
        plans: [
          {
            name: 'Monthly',
            price: '$9',
            tokens_limit: 100000,
            max_users: 3,
            stripePriceId: 'price_1OKR3gGWvJkW2hKDp42NylVR',
          },
        ],
      },
      {
        name: 'Premium',
        description: 'Description of your Premium plan',
        badge: ``,
        features: ['access to all tools', '4 team members'],
        plans: [
          {
            name: '',
            price: '29$',
            stripePriceId: 'price_1OKR4JGWvJkW2hKDxr9CTE2S',
            tokens_limit: 3000000,
            max_users: 5,
          },
        ],
      },
    ],
  },
};

export const INFINITY_CONSIDERED_TOKENS = 3000000;

export default configuration;

// Validate Stripe configuration
// as this is a new requirement, we throw an error if the key is not defined
// in the environment
if (
  configuration.stripe.embedded &&
  production &&
  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
) {
  throw new Error(
    'The key NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined. Please add it to your environment variables.',
  );
}

function getBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return defaultValue;
}
