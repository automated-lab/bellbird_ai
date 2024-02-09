import { headers } from 'next/headers';
import clsx from 'clsx';

import LogoImage from '~/core/ui/Logo/LogoImage';
import I18nProvider from '~/i18n/I18nProvider';
import getLanguageCookie from '~/i18n/get-language-cookie';
import initializeServerI18n from '~/i18n/i18n.server';
import { withI18n } from '~/i18n/with-i18n';
import SignOutButton from '~/components/SignOutButton';

async function SubscriptionLayout({ children }: React.PropsWithChildren) {
  const { csrfToken, language } = await loadData();

  if (!csrfToken) {
    return null;
  }

  return (
    <I18nProvider lang={language}>
      <div className={'flex flex-1 flex-col dark:bg-background py-8 h-screen'}>
        <div className={'flex justify-between px-4 sm:px-8 pb-8'}>
          <LogoImage />
          <div>
            <SignOutButton />
          </div>
        </div>

        <div
          className={clsx(
            'flex flex-1 flex-col items-center justify-center mx-2 pb-8',
          )}
        >
          <div
            className={
              'flex flex-col space-y-16 w-full lg:p-16' +
              ' lg:rounded-md zoom-in-95 animate-in fade-in ease-out' +
              ' duration-1000 slide-in-from-bottom-24'
            }
          >
            {children}
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}

export default withI18n(SubscriptionLayout);

async function loadData() {
  const csrfToken = headers().get('X-CSRF-Token');
  const { language } = await initializeServerI18n(getLanguageCookie());

  const payload = { csrfToken, language };

  return payload;
}
