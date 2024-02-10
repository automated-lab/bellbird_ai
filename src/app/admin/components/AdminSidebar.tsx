'use client';

import {
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  PencilSquareIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Sidebar, { SidebarContent, SidebarItem } from '~/core/ui/Sidebar';
import Logo from '~/core/ui/Logo';

import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent className={'mt-4 mb-8 pt-2'}>
        <Logo href={'/admin'} />
      </SidebarContent>

      <SidebarContent>
        <SidebarItem
          end
          path={ADMIN_NAVIGATION_CONFIG.admin.path}
          Icon={() => <HomeIcon className={'h-6'} />}
        >
          Admin
        </SidebarItem>

        <SidebarItem
          path={ADMIN_NAVIGATION_CONFIG.templates.path}
          Icon={() => <PencilSquareIcon className={'h-6'} />}
        >
          Templates
        </SidebarItem>

        <SidebarItem
          end
          path={ADMIN_NAVIGATION_CONFIG.fields.path}
          Icon={() => <PuzzlePieceIcon className={'h-6'} />}
        >
          Fields
        </SidebarItem>

        <SidebarItem
          path={ADMIN_NAVIGATION_CONFIG.users.path}
          Icon={() => <UserIcon className={'h-6'} />}
        >
          Users
        </SidebarItem>

        <SidebarItem
          path={ADMIN_NAVIGATION_CONFIG.workspaces.path}
          Icon={() => <UserGroupIcon className={'h-6'} />}
        >
          Workspaces
        </SidebarItem>

        <SidebarItem
          path={ADMIN_NAVIGATION_CONFIG.externalApps.path}
          Icon={() => <GlobeAsiaAustraliaIcon className={'h-6'} />}
        >
          External Apps
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
