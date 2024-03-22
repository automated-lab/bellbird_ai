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
  const { title, maxConcurrentGenerations, image, description, fields } = data;

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <BackButton variant="outline" className="mb-4 w-min" />
        <CardTitle className="flex items-center gap-2">
          <Avatar className="bg-blue-200 rounded-sm">
            <AvatarImage
              src={image}
              width={40}
              height={40}
              className="object-contain w-11 h-11 bg-blue-50"
            />
          </Avatar>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ToolFormBuilder
          fields={fields as ITemplateField[]}
          maxConcurrentGenerations={maxConcurrentGenerations}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default ToolBar;
