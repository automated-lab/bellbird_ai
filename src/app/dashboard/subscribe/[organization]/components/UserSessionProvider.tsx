'use client';
import { useMemo, useState } from 'react';

import UserSessionContext from '~/core/session/contexts/user-session';
import UserSession from '~/core/session/types/user-session';
import loadSubscribeData from '~/lib/server/loaders/load-subscribe-data';

export const UserSessionProvider = ({
  data,
  children,
}: {
  data: Awaited<ReturnType<typeof loadSubscribeData>>;
  children: React.ReactNode;
}) => {
  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: data.auth,
      data: data.user ?? undefined,
      role: data.role,
    };
  }, [data]);
  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  return (
    <UserSessionContext.Provider
      value={{
        userSession,
        setUserSession,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};
