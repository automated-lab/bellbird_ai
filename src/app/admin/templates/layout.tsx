import React from 'react';

import AppContainer from '~/app/dashboard/[organization]/components/AppContainer';

function TemplatesLayout(
  props: React.PropsWithChildren<{ modal: React.ReactNode }>,
) {
  return (
    <main
      className={
        'flex flex-col justify-between w-full min-h-screen overflow-auto'
      }
    >
      <AppContainer className="pb-24">
        {props.modal}
        {props.children}
      </AppContainer>
    </main>
  );
}

export default TemplatesLayout;
