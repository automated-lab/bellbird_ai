import { permanentRedirect } from 'next/navigation';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getUserById } from '~/lib/user/database/queries';
import requireSession from '~/lib/user/require-session';
import configuration from '~/configuration';

async function AppPage() {
  const client = getSupabaseServerComponentClient();

  const user = await client.auth.getUser();

  if (!user) {
    permanentRedirect(configuration.paths.signIn);
  }

  permanentRedirect(configuration.paths.appHome);

  return null;
}

export default AppPage;
