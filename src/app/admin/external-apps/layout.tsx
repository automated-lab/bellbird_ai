import React from 'react';

import AppContainer from '~/app/dashboard/[organization]/components/AppContainer';

function FieldsLayout(
  props: React.PropsWithChildren<{ modal: React.ReactNode }>,
) {
  return (
    <main className={'flex flex-col justify-between w-full'}>
      <AppContainer>
        {props.modal}
        {props.children}
      </AppContainer>
    </main>
  );
}

export default FieldsLayout;
