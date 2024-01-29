'use client';

import { useMemo } from 'react';

import useCurrentOrganization from './use-current-organization';

export const useCurrentOrganizationId = () => {
  const organization = useCurrentOrganization();

  return useMemo(() => organization.id, [organization.id]);
};
