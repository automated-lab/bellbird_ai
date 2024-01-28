'use client';

import AppContainer from '~/app/dashboard/[organization]/components/AppContainer';
import Alert from '~/core/ui/Alert';

function TemplateAdminPageError(props: { error: { message: string } }) {
  console.error(props.error);

  return (
    <AppContainer>
      <Alert type={'error'}>
        <Alert.Heading>Could not load admin templates</Alert.Heading>
        <p>
          There was an error loading the templates. Please check your console
          errors.
        </p>
        <p className={'text-lg bg-white w-full border rounded-lg p-4'}>
          {props.error.message}
        </p>
      </Alert>
    </AppContainer>
  );
}

export default TemplateAdminPageError;
