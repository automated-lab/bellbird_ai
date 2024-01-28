import { use } from 'react';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import AdminGuard from '~/app/admin/components/AdminGuard';

import DeleteFieldModal from '../components/DeleteFieldModal';
import { getField } from '~/lib/fields/queries';

interface Params {
  params: {
    field_id: string;
  };
}

function DeleteFieldModalPage({ params }: Params) {
  const client = getSupabaseServerComponentClient({ admin: true });

  const { data, error } = use(getField(client, params.field_id));

  if (!data || error) {
    throw new Error(`Field not found`);
  }

  return <DeleteFieldModal field={data} />;
}

export default AdminGuard(DeleteFieldModalPage);
