import React from 'react';

import { withI18n } from '~/i18n/with-i18n';
import AppHeader from '../components/AppHeader';
import AppContainer from '../components/AppContainer';

type ToolsPageLayoutProps = React.PropsWithChildren;

function ToolsPageLayout(props: ToolsPageLayoutProps) {
  return (
    <main>
      <AppHeader title="Tools" />

      <AppContainer>{props.children}</AppContainer>
    </main>
  );
}

export default withI18n(ToolsPageLayout);
