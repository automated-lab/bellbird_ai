import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import { BoltIcon } from '@heroicons/react/24/outline';

import { Card, CardContent } from '~/core/ui/Card';
import Button from '~/core/ui/Button';
import { Progress } from '~/core/ui/progress';
import Loading from '~/components/Loading';

import useUserId from '~/core/hooks/use-user-id';
import { getUserUsageById } from '~/lib/user_usage/queries';
import useSupabase from '~/core/hooks/use-supabase';
import useCollapsible from '~/core/hooks/use-sidebar-state';
import { useSidebarContext } from '~/core/hooks/use-sidebar-context';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import { getKeyIf, queryKeys } from '~/lib/query-keys';
import useUserSession from '~/core/hooks/use-user-session';
import { isActiveSubscription } from '~/lib/stripe/utils';
import If from '~/core/ui/If';
import UsageProgress from './UsageProgress';

export const UsageCounter = () => {
  const { collapsed: isSidebarCollapsed } = useSidebarContext();

  const router = useRouter();

  const user = useUserSession();

  const hasActiveSubscription = isActiveSubscription(
    user?.data?.subscription?.status,
  );

  const handleUpgrade = () => {
    router.push('/dashboard/upgrade');
  };

  return (
    <Card className="bg-white/10 border-0">
      {!isSidebarCollapsed ? (
        <CardContent className="py-6">
          <UsageProgress />

          <If condition={!hasActiveSubscription}>
            <Button
              onClick={handleUpgrade}
              variant="premium"
              color="blue"
              className="w-full"
            >
              Upgrade
              <BoltIcon className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </If>
        </CardContent>
      ) : (
        <If condition={!hasActiveSubscription}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleUpgrade}
                variant="premium"
                size="icon"
                color="blue"
                className="w-full"
              >
                <BoltIcon className="w-4 h-4 fill-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upgrade your plan</TooltipContent>
          </Tooltip>
        </If>
      )}
    </Card>
  );
};
