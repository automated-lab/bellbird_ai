import React, { use } from 'react';

import BackButton from '~/components/BackButton';
import FormTile from '~/components/FormTile';
import CreateTemplateForm from './components/CreateTemplateForm';

import AdminGuard from '~/app/admin/components/AdminGuard';
import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';
import { getTemplateWithPrompt } from '~/lib/templates/queries';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { ITemplate } from '~/lib/templates/types';

type CreateTemplatePageProps = {
  params: {
    template_id: string;
  };
};

function CreateTemplatePage({ params }: CreateTemplatePageProps) {
  const template_id = params.template_id;
  const isNew = template_id === 'create';

  let template: ITemplate | null = null;

  if (!isNew) {
    const client = getSupabaseServerComponentClient({ admin: true });

    const { data, error } = use(getTemplateWithPrompt(client, template_id));

    if (error) {
      throw error;
    }

    template = data;
  }

  return (
    <div className="space-y-6 w-full h-full">
      <BackButton href={ADMIN_NAVIGATION_CONFIG.templates.path} />
      <FormTile
        heading="Template Details"
        subHeading="Fill out the form below to create a new template"
      >
        <CreateTemplateForm templateId={template_id} defaultData={template} />
      </FormTile>
    </div>
  );
}

export default AdminGuard(CreateTemplatePage);
