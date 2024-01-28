'use client';

import AppContainer from '~/app/dashboard/[organization]/components/AppContainer';
import Alert from '~/core/ui/Alert';

function FieldAdminPageError() {
  return (
    <AppContainer>
      <Alert type={'error'}>
        <Alert.Heading>Could not load fields</Alert.Heading>
        <p>
          There was an error loading the fields. Please check your console
          errors.
        </p>
      </Alert>
    </AppContainer>
  );
}

export default FieldAdminPageError;
