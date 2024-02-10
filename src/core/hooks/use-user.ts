'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import useSupabase from '~/core/hooks/use-supabase';
import { queryKeys } from '~/lib/query-keys';

/**
 * @name useUser
 */
function useUser() {
  const router = useRouter();
  const client = useSupabase();
  const key = queryKeys.userMe;

  return useSWR(key, async () => {
    return client.auth
      .getUser()
      .then((result) => {
        if (result.error) {
          return Promise.reject(result.error);
        }

        if (result.data && result.data.user) {
          return result.data.user;
        }

        return Promise.reject('Unexpected result format');
      })
      .catch(() => {
        return router.refresh();
      });
  });
}

export default useUser;
