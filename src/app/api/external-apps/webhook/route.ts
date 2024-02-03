import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import { insertSecret } from '~/lib/secrets/mutations';
import { getSecret } from '~/lib/secrets/queries';

const crypto = require('crypto');

export async function GET(request: Request) {
  const body = request;
  const client = getSupabaseRouteHandlerClient({ admin: true });

  const signature = crypto.randomBytes(64).toString('hex');

  const res = await getSecret(client, 'testing');

  console.log(res);

  console.log(signature);

  return new Response(`Hello Aissa! ${signature}`);
}
