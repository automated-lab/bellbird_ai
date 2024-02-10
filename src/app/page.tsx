import { permanentRedirect } from 'next/navigation';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import configuration from '~/configuration';

async function AppPage() {
  const client = getSupabaseServerComponentClient();

  const user = await client.auth.getUser();

  if (!user.data || user.error) {
    permanentRedirect(configuration.paths.signIn);
  }

  permanentRedirect(configuration.paths.appPrefix);

  return null;
}

export default AppPage;
