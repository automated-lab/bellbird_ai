'use client';

import { useRouter } from 'next/navigation';

import { BoltIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '~/core/ui/Card';
import Button from '~/core/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import If from '~/core/ui/If';
import UsageProgress from './UsageProgress';

import { useSidebarContext } from '~/core/hooks/use-sidebar-context';
import { isActiveSubscription } from '~/lib/stripe/utils';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

export const UsageCounter = () => {
  const { collapsed: isSidebarCollapsed } = useSidebarContext();

  console.log(isSidebarCollapsed);

  const router = useRouter();
  const organization = useCurrentOrganization();

  const hasActiveSubscription = isActiveSubscription(
    organization.subscription?.data.status,
  );

  const handleUpgrade = () => {
    router.push('/dashboard/upgrade');
  };

  return (
    <Card>
      {!isSidebarCollapsed ? (
        <CardContent className="py-4">
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
