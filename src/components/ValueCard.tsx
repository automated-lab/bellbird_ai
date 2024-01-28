import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { cn } from '~/core/generic/shadcn-utils';
import IconButton from '~/core/ui/IconButton';

type ValueCardProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

const ValueCard = ({ label, onRemove, className }: ValueCardProps) => {
  return (
    <div
      className={cn(
        'flex justify-between items-center rounded-md border border-accent px-4 py-2 text-sm shadow-sm',
        className,
      )}
    >
      {label}
      <IconButton type="button" onClick={onRemove}>
        <XMarkIcon className="h-4 text-gray-500 dark:text-gray-400" />
      </IconButton>
    </div>
  );
};

export default ValueCard;
