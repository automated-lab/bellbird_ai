import React from 'react';

import { PageBody } from '~/core/ui/Page';
import AdminHeader from '~/app/admin/components/AdminHeader';

function FieldsLayout(
  props: React.PropsWithChildren<{ modal: React.ReactNode }>,
) {
  return (
    <main className={'flex flex-col justify-between w-full'}>
      <AdminHeader>Fields</AdminHeader>

      <PageBody>
        {props.modal}
        {props.children}
      </PageBody>
    </main>
  );
}

export default FieldsLayout;
