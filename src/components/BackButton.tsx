'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import Button, { ButtonProps } from '~/core/ui/Button';
import { useRouter } from 'next/navigation';
import { cn } from '~/core/generic/shadcn-utils';

type BackButtonProps = {
  href?: string;
  className?: string;
  variant?: ButtonProps['variant'];
};

const BackButton = ({
  href,
  variant = 'outline',
  className,
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={cn('flex items-center', className)}
      type="button"
      href={href}
      onClick={() => !href && router.back()}
    >
      <ArrowLeftIcon className="w-4 h-4 mr-1" />
      Back
    </Button>
  );
};

export default BackButton;
