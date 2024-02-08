import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import { PageHeader } from '~/core/ui/Page';
import AdminMobileNavigation from './AdminMobileNavigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

function AdminHeader({ children }: React.PropsWithChildren) {
  return (
    <PageHeader
      title={
        <div className="flex items-center gap-3">
          <div className={'flex items-center lg:hidden'}>
            <AdminMobileNavigation />
          </div>
          {children}
        </div>
      }
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={'ghost'} href={'/dashboard'}>
            <span className={'flex space-x-2.5 items-center'}>
              <ArrowLeftIcon className={'w-4 h-4'} />

              <span className="max-md:hidden">Back to App</span>
            </span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>Back to App</TooltipContent>
      </Tooltip>
    </PageHeader>
  );
}

export default AdminHeader;
