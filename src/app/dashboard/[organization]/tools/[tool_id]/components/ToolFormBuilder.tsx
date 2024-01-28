'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import InputBuilder from './InputBuilder';
import type { ITemplateField } from '~/lib/fields/types';
import { TextFieldInput } from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { ToolFormData } from '../types';

type ToolFormBuilderProps = {
  fields: ITemplateField[];
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
};

function ToolFormBuilder({
  fields,
  onSubmit,
  isSubmitting,
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
    max: 5,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full flex flex-col justify-between gap-10"
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
        <TextFieldInput
          placeholder="Qty"
          type="number"
          min={1}
          max={5}
          step={1}
          className="!w-16"
          {...qtyControl}
        />
        <Button variant="default" loading={isSubmitting} className="w-full">
          Generate
        </Button>
      </div>
    </form>
  );
}

export default ToolFormBuilder;
