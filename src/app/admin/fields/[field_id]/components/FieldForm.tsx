'use client';

import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '~/core/ui/Button';
import { Checkbox } from '~/core/ui/Checkbox';
import Heading from '~/core/ui/Heading';
import TextField from '~/core/ui/TextField';
import { Tabs, TabsList, TabsTrigger } from '~/core/ui/Tabs';
import If from '~/core/ui/If';
import Alert, { AlertHeading } from '~/core/ui/Alert';

import CollapsibleCards from '~/app/admin/fields/[field_id]/components/CollapsibleCards';
import OptionsInput from '~/app/admin/fields/[field_id]/components/OptionsInput';
import { generateTag, getUnmatchedValues } from '~/core/generic/generic-utils';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import { createNewFieldAction, updateFieldAction } from '~/lib/fields/actions';

import {
  templateFieldTypes,
  type ITemplateFieldForm,
  ITemplateField,
} from '~/lib/fields/types';
import Textarea from '~/core/ui/Textarea';
import { useSWRConfig } from 'swr';
import { queryKeys } from '~/lib/query-keys';

type FieldFormProps = {
  defaultData: ITemplateField | null;
  isNew: boolean;
  onSuccess?: () => void;
};

export default function FieldForm({
  defaultData,
  isNew,
  onSuccess,
}: FieldFormProps) {
  const [pending, startTransition] = useTransition();
  const { mutate } = useSWRConfig();
  const csrfToken = useCsrfToken();

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ITemplateFieldForm>({
    defaultValues: {
      type: isNew ? 'text' : defaultData?.type,
      name: isNew ? '' : defaultData?.name,
      field_tag: isNew ? '' : defaultData?.field_tag,
      description: isNew ? undefined : defaultData?.description,
      placeholder: isNew ? undefined : defaultData?.placeholder,
      default_value: isNew ? undefined : defaultData?.default_value,
      is_required: isNew ? true : defaultData?.is_required,
      options: isNew ? [] : defaultData?.options,
    },
  });

  const hasOptions = watch('type') === 'select';

  // fields validations
  const nameControl = register('name', {
    required: 'Name is required',
    minLength: {
      value: 3,
      message: 'Name must be at least 3 characters',
    },
  });

  const descriptionControl = register('description', {
    required: 'Description is required',
    maxLength: {
      value: 150,
      message: 'Description must be less than 150 characters',
    },
  });

  const placeholderControl = register('placeholder', {
    maxLength: {
      value: 80,
      message: 'Placeholder must be less than 80 characters',
    },
  });

  const defaultValueControl = register('default_value', {});

  const fieldTagControl = register('field_tag', {
    required: 'Field tag is required',
    pattern: {
      value: /^[a-z0-9_-]+$/i,
      message: 'Field tag can only contain letters and hyphens',
    },
  });

  const typeRules = {
    validate: (value: string) =>
      ['text', 'textarea', 'select'].includes(value) || 'Invalid type',
  };

  const optionsRules = {
    required: hasOptions ? 'At least one option is required' : '',
  };

  // Submit handler
  const onSubmit = useCallback(
    (fieldData: ITemplateFieldForm) => {
      startTransition(async () => {
        try {
          if (isNew) {
            await createNewFieldAction({ fieldData, csrfToken });
            reset();
          } else {
            const fieldUpdates = getUnmatchedValues(fieldData, defaultData);

            await updateFieldAction({
              fieldId: defaultData?.id!,
              fieldUpdates,
              csrfToken,
            });
          }

          toast.success(
            isNew ? 'Field Created Successfully' : 'Field Updated Successfully',
          );

          mutate(queryKeys.fieldList);
          onSuccess?.();
        } catch (e: any) {
          setError(e?.message);
        }
      });
    },
    [csrfToken, defaultData, isNew, reset],
  );

  // Generate field tag
  useEffect(() => {
    const generateFieldTag = () => {
      const name = getValues('name');
      setValue('field_tag', generateTag(name));
    };
    generateFieldTag();
  }, [watch('name'), getValues, setValue]);

  useEffect(() => {
    setError(null);
  }, [errors]);

  return (
    <form className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Controller
          control={control}
          name="type"
          rules={typeRules}
          render={({ field: { onChange, ...field } }) => {
            return (
              <TextField className="sm:col-span-2">
                <TextField.Label>
                  <span>Input Type</span>
                  <Tabs {...field} onValueChange={onChange}>
                    <TabsList>
                      {templateFieldTypes.map((type) => (
                        <TabsTrigger
                          key={type}
                          type="button"
                          value={type}
                          className="capitalize"
                        >
                          {type}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <TextField.Error error={errors.type?.message} />
                </TextField.Label>
              </TextField>
            );
          }}
        />

        <TextField>
          <TextField.Label>
            <span>Name</span>
            <TextField.Hint>The display name for the field</TextField.Hint>
            <TextField.Input placeholder="Name" {...nameControl} />
            <TextField.Error error={errors.name?.message} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <span>Tag</span>
            <TextField.Hint>
              The unique identifier tag for the field
            </TextField.Hint>
            <TextField.Input placeholder="Tag" {...fieldTagControl} />
            <TextField.Error error={errors.field_tag?.message} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <span>Placeholder</span>
            <TextField.Hint>
              The placeholder text to show in the input field
            </TextField.Hint>
            <TextField.Input
              placeholder="Placeholder"
              {...placeholderControl}
            />
            <TextField.Error error={errors.placeholder?.message} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <span>Description</span>
            <TextField.Hint>
              A short description explaining the field&apos;s purpose
            </TextField.Hint>
            <TextField.Input
              placeholder="Description"
              {...descriptionControl}
            />
            <TextField.Error error={errors.description?.message} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <span>Default Value</span>
            <TextField.Hint>
              A default value to prefill for the field
            </TextField.Hint>
            <TextField.Input
              placeholder="Default Value"
              {...defaultValueControl}
            />
            <TextField.Error error={errors.default_value?.message} />
          </TextField.Label>
        </TextField>

        <If condition={hasOptions}>
          <Controller
            control={control}
            name="options"
            rules={optionsRules}
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <TextField>
                  <TextField.Label>
                    <span>Options</span>
                    <TextField.Hint>
                      List of dropdown options (for select fields)
                    </TextField.Hint>
                    <OptionsInput
                      placeholder="Options separated by commas ','"
                      options={value || []}
                      onChange={onChange}
                    />
                    <TextField.Error error={errors.options?.message} />
                  </TextField.Label>
                  <CollapsibleCards
                    items={value || []}
                    onRemove={(index) =>
                      onChange(value?.filter((_, id) => id !== index))
                    }
                  />
                </TextField>
              );
            }}
          />
        </If>
      </div>

      <If condition={error}>
        <Alert type={'error'}>
          <AlertHeading>Create Field Error</AlertHeading>
          {error}
        </Alert>
      </If>

      <div className="flex justify-end gap-4">
        {/* <BackButton /> */}
        <div className="space-x-2">
          <Button onClick={handleSubmit(onSubmit)} loading={pending}>
            {isNew ? 'Publish' : 'Update'}
          </Button>
        </div>
      </div>
    </form>
  );
}
