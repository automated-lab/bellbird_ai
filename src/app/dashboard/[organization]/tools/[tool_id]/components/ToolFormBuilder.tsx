'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import InputBuilder from './InputBuilder';
import type { ITemplateField } from '~/lib/fields/types';
import { TextFieldInput } from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { ToolFormData } from '../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

type ToolFormBuilderProps = {
  fields: ITemplateField[];
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  maxConcurrentGenerations?: number;
};

function ToolFormBuilder({
  fields,
  onSubmit,
  isSubmitting,
  maxConcurrentGenerations,
}: ToolFormBuilderProps) {
  const defaultValues = fields.reduce((acc: any, field) => {
    acc[field.field_tag] = field.default_value;
    return acc;
  }, {});

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ToolFormData>({
    defaultValues: {
      qty: 1,
      ...defaultValues,
    },
  });

  const qtyControl = register('qty', {
    valueAsNumber: true,
    min: 1,
    max: maxConcurrentGenerations,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full gap-10"
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <InputBuilder
            key={field.id}
            field={field}
            control={control}
            errors={errors}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Tooltip disabled={Number(maxConcurrentGenerations) > 1}>
          <TooltipTrigger asChild>
            <TextFieldInput
              placeholder="Qty"
              type="number"
              min={1}
              max={maxConcurrentGenerations}
              disabled={maxConcurrentGenerations === 1}
              step={1}
              className="!w-16"
              {...qtyControl}
            />
          </TooltipTrigger>
          <TooltipContent>
            This tool is limited to {maxConcurrentGenerations} generations at a
            time.
          </TooltipContent>
        </Tooltip>
        <Button variant="default" loading={isSubmitting} className="w-full">
          Generate
        </Button>
      </div>
    </form>
  );
}

export default ToolFormBuilder;
