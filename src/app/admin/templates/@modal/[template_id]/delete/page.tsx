import { use } from 'react';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import AdminGuard from '~/app/admin/components/AdminGuard';

import DeleteTemplateModal from '../components/DeleteTemplateModal';
import { getTemplateById } from '~/lib/templates/queries';

interface Params {
  params: {
    template_id: string;
  };
}

function DeleteTemplateModalPage({ params }: Params) {
  const client = getSupabaseServerComponentClient({ admin: true });

  const { data, error } = use(getTemplateById(client, params.template_id));

  console.log(data, error);

  if (!data || error) {
    throw new Error(`Template not found`);
  }

  return <DeleteTemplateModal template={data} />;
}

export default AdminGuard(DeleteTemplateModalPage);
