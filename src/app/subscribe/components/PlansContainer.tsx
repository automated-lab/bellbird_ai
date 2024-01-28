'use client';

import React from 'react';

import Plans from '~/components/Plans';

import CsrfTokenContext from '~/lib/contexts/csrf';
import useSupabase from '~/core/hooks/use-supabase';

type Props = { csrfToken: string };

const PlansContainer = ({ csrfToken }: Props) => {
  const client = useSupabase();

  return (
    <CsrfTokenContext.Provider value={csrfToken}>
      <Plans client={client} />
    </CsrfTokenContext.Provider>
  );
};

export default PlansContainer;
