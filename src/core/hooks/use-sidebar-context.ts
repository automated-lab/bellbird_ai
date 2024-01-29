import { useContext } from 'react';

import SidebarContext from '~/lib/contexts/sidebar';

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }

  return context;
};
