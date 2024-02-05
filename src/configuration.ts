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
    name: 'Awesomely - Your SaaS Title',
    description: 'Your SaaS Description',
    themeColor: '#ffffff',
    themeColorDark: '#0a0a0a',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Awesomely',
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
    subscribe: '/subscribe',
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
        features: ['50,000 token'],
        plans: [
          {
            name: 'Monthly',
            price: '$9',
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
        features: ['100,000 token'],
        plans: [
          {
            name: 'Monthly',
            price: '$29',
            tokens_limit: 100000,
            max_users: 3,
            stripePriceId: 'price_1OKR4JGWvJkW2hKDxr9CTE2S',
          },
        ],
      },
      {
        name: 'Premium',
        description: 'Description of your Premium plan',
        badge: ``,
        features: ['Unlimited Tokens'],
        plans: [
          {
            name: '',
            price: 'Contact us',
            stripePriceId: '',
            tokens_limit: Infinity,
            max_users: 5,
            label: `Contact us`,
            href: `/contact`,
          },
        ],
      },
    ],
  },
};

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
