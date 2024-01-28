import React from 'react';

import Container from '~/core/ui/Container';

function FieldPageLayout(props: React.PropsWithChildren) {
  return <Container>{props.children}</Container>;
}

export default FieldPageLayout;
