import {
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  PencilSquareIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface IAdminNavigationConfig {
  [key: string]: {
    label: string;
    path: string;
    Icon: ({ className }: { className: string }) => JSX.Element;
    end?: boolean;
  };
}

const DEFAULT_PAGE_SIZE = 10;

const ADMIN_NAVIGATION_CONFIG = {
  admin: {
    label: 'Admin',
    path: '/admin',
    Icon: ({ className }: { className: string }) => {
      return <HomeIcon className={className} />;
    },
    end: true,
  },
  templates: {
    label: 'Templates',
    path: '/admin/templates',
    Icon: ({ className }: { className: string }) => {
      return <PencilSquareIcon className={className} />;
    },
  },
  fields: {
    label: 'Fields',
    path: '/admin/fields',
    Icon: ({ className }: { className: string }) => {
      return <PuzzlePieceIcon className={className} />;
    },
  },
  users: {
    label: 'Users',
    path: '/admin/users',
    Icon: ({ className }: { className: string }) => {
      return <UserIcon className={className} />;
    },
  },
  workspaces: {
    label: 'Workspaces',
    path: '/admin/workspaces',
    Icon: ({ className }: { className: string }) => {
      return <UserGroupIcon className={className} />;
    },
  },
  externalApps: {
    label: 'External Apps',
    path: '/admin/external-apps',
    Icon: ({ className }: { className: string }) => {
      return <GlobeAsiaAustraliaIcon className={className} />;
    },
  },
} as const;

export { ADMIN_NAVIGATION_CONFIG, DEFAULT_PAGE_SIZE };
