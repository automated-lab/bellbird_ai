import {
  CreditCardIcon,
  FolderIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import configuration from '~/configuration';

type Divider = {
  divider: true;
};

type NavigationItemLink = {
  label: string;
  path: string;
  Icon: (props: { className: string }) => JSX.Element;
  end?: boolean;
};

type NavigationGroup = {
  label: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children: NavigationItemLink[];
};

type NavigationItem = NavigationItemLink | NavigationGroup | Divider;

type NavigationConfig = {
  items: NavigationItem[];
};

const paths = configuration.paths;

const NAVIGATION_CONFIG = (organization: string): NavigationConfig => ({
  items: [
    {
      label: 'common:dashboardTabLabel',
      path: getPath(organization, ''),
      Icon: ({ className }: { className: string }) => {
        return <Squares2X2Icon className={className} />;
      },
      end: true,
    },
    {
      label: 'common:ToolsTabLabel',
      path: getPath(organization, paths.tools),
      Icon: ({ className }: { className: string }) => {
        return <Square3Stack3DIcon className={className} />;
      },
      end: true,
    },
    {
      label: 'common:MyCollectionsTabLabel',
      path: getPath(organization, paths.collections),
      Icon: ({ className }: { className: string }) => {
        return <FolderIcon className={className} />;
      },
      end: true,
    },
    {
      label: 'common:settingsTabLabel',
      collapsible: false,
      children: [
        {
          label: 'common:profileSettingsTabLabel',
          path: getPath(organization, paths.settings.profile),
          Icon: ({ className }: { className: string }) => {
            return <UserIcon className={className} />;
          },
        },
        {
          label: 'common:organizationSettingsTabLabel',
          path: getPath(organization, paths.settings.organization),
          Icon: ({ className }: { className: string }) => {
            return <UserGroupIcon className={className} />;
          },
        },
        {
          label: 'common:subscriptionSettingsTabLabel',
          path: getPath(organization, paths.settings.subscription),
          Icon: ({ className }: { className: string }) => {
            return <CreditCardIcon className={className} />;
          },
        },
      ],
    },
  ],
});

export default NAVIGATION_CONFIG;

export function getPath(organizationId: string, path: string) {
  const appPrefix = configuration.paths.appPrefix;

  return [appPrefix, organizationId, path].filter(Boolean).join('/');
}
