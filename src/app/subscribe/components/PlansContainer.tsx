'use client';

import React from 'react';

import Plans from '~/components/Plans';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const PlansContainer = () => {
  const organization = useCurrentOrganization();

  return <Plans organization={organization} />;
};

export default PlansContainer;
