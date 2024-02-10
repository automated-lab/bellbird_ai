import { redirect } from 'next/navigation';
import configuration from '~/configuration';

function SubscribePage() {
  return redirect(configuration.paths.appPrefix);
}

export default SubscribePage;
