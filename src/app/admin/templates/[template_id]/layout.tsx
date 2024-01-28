import React from 'react';

import Container from '~/core/ui/Container';

function CreateTemplateLayout(props: React.PropsWithChildren) {
  return <Container>{props.children}</Container>;
}

export default CreateTemplateLayout;
