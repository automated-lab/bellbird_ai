'use client';

import React, { useState } from 'react';

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import Button from '~/core/ui/Button';
import { toast } from 'sonner';

type CopyButtonProps = {
  content: string;
  className?: string;
};

const CopyButton = ({ content, className }: CopyButtonProps) => {
  const handleCopy = () => {
    window?.navigator.clipboard.writeText(content);

    toast.success('Copied to clipboard');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className={className}
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy to clipboard</TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
