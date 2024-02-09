'use client';

import React from 'react';

import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';

import useSignOut from '~/core/hooks/use-sign-out';

const SignOutButton = () => {
  const signOut = useSignOut();

  return (
    <Button
      variant="custom"
      className="text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50"
      onClick={signOut}
    >
      <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" /> Sign out
    </Button>
  );
};

export default SignOutButton;
