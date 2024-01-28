import React from 'react';

import { withI18n } from '~/i18n/with-i18n';
import AppHeader from '~/app/dashboard/[organization]/components/AppHeader';
import AppContainer from '~/app/dashboard/[organization]/components/AppContainer';

type ToolsPageLayoutProps = React.PropsWithChildren<{
  modal: React.ReactNode;
}>;

function ToolsPageLayout(props: ToolsPageLayoutProps) {
  return (
    <main className="h-full">
      <AppHeader title="My Collections" />

      <AppContainer>
        {props.modal}
        {props.children}
      </AppContainer>
    </main>
  );
}

export default withI18n(ToolsPageLayout);
