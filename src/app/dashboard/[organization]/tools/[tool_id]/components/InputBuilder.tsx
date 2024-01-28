import React, { useCallback, useMemo } from 'react';
import {
  Controller,
  type Control,
  type FieldErrors,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';

import TextField from '~/core/ui/TextField';
import Textarea from '~/core/ui/Textarea';

import type { ITemplateField, templateFieldTypes } from '~/lib/fields/types';
import SelectField from './SelectField';
import { ToolFormData } from '../types';

type InputBuilderProps = {
  field: ITemplateField;
  control: Control<ToolFormData>;
  errors: FieldErrors;
};

function InputBuilder({ field, control, errors }: InputBuilderProps) {
  const Input = useMemo(() => {
    switch (field.type) {
      case 'text':
        return TextField.Input;
      case 'textarea':
        return Textarea;
      case 'select':
        return SelectField;
      default:
        return TextField.Input;
    }
  }, [field.type]);

  const inputRules = {
    text: {
      required: field.is_required ? `${field.name} is required` : false,
    },
    textarea: {
      required: field.is_required ? `${field.name} is required` : false,
    },
    select: {
      required: field.is_required ? `${field.name} is required` : false,
    },
  };

  return (
    <Controller
      control={control}
      name={field.field_tag}
      rules={inputRules?.[field.type]}
      render={({ field: { value, onChange, ...rest } }) => (
        <TextField>
          <TextField.Label>
            <span>{field.name}</span>
            <TextField.Hint>{field.description}</TextField.Hint>
            <Input
              options={field.options || []}
              value={value}
              onChange={onChange}
              placeholder={field.placeholder}
              {...rest}
            />
          </TextField.Label>
          <TextField.Error error={errors[field.field_tag]?.message as string} />
        </TextField>
      )}
    />
  );
}

export default InputBuilder;
