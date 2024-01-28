import React, { use } from 'react';

import FormTile from '~/components/FormTile';
import FieldForm from '~/app/admin/fields/[field_id]/components/FieldForm';
import BackButton from '~/components/BackButton';

import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';
import AdminGuard from '~/app/admin/components/AdminGuard';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { getField } from '~/lib/fields/queries';
import { ITemplateField } from '~/lib/fields/types';

type FieldPageProps = {
  params: {
    field_id: string;
  };
};

function FieldPage({ params }: FieldPageProps) {
  const field_id = params.field_id;

  const isNew = field_id === 'create';

  let field: ITemplateField | null = null;

  if (!isNew) {
    const client = getSupabaseServerComponentClient({ admin: true });

    const { data, error } = use(getField(client, field_id));

    if (error) {
      throw error;
    }

    field = data;
  }

  return (
    <div className="space-y-6 w-full h-full">
      <BackButton href={ADMIN_NAVIGATION_CONFIG.fields.path} />
      <FormTile
        heading={isNew ? 'Create New Field' : 'Edit Field'}
        subHeading={isNew ? 'Create a new field' : 'Edit an existing field'}
      >
        <FieldForm isNew={isNew} defaultData={field} />
      </FormTile>
    </div>
  );
}

export default AdminGuard(FieldPage);
