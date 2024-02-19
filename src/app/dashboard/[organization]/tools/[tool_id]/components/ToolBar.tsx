'use client';

import React from 'react';
import BackButton from '~/components/BackButton';
import { Avatar, AvatarImage } from '~/core/ui/Avatar';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/core/ui/Card';

import ToolFormBuilder from './ToolFormBuilder';

import type { ITemplate } from '~/lib/templates/types';
import { ITemplateField } from '~/lib/fields/types';
import { cn } from '~/core/generic/shadcn-utils';

type ToolBarProps = {
  data: ITemplate;
  className?: string;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
};

function ToolBar({ data, onSubmit, isSubmitting, className }: ToolBarProps) {
  const { id, title, category, image, description, isNew, fields } = data;

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <BackButton variant="outline" className="w-min mb-4" />
        <CardTitle className="flex items-center gap-2">
          <Avatar className="bg-blue-200 rounded-sm">
            <AvatarImage
              src={image}
              width={40}
              height={40}
              className="w-11 h-11 object-contain bg-blue-50"
            />
          </Avatar>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ToolFormBuilder
          fields={fields as ITemplateField[]}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default ToolBar;
