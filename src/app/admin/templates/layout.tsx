import React from 'react';

import { PageBody } from '~/core/ui/Page';
import AdminHeader from '~/app/admin/components/AdminHeader';

function TemplatesLayout(
  props: React.PropsWithChildren<{ modal: React.ReactNode }>,
) {
  return (
    <main
      className={
        'flex flex-col justify-between w-full min-h-screen overflow-auto'
      }
    >
      <AdminHeader>Templates Center</AdminHeader>

      <PageBody className="pb-24">
        {props.modal}
        {props.children}
      </PageBody>
    </main>
  );
}

export default TemplatesLayout;
