'use client';

import React, { useCallback, useId, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Heading from '~/core/ui/Heading';
import TextField from '~/core/ui/TextField';
import Textarea from '~/core/ui/Textarea';
import Button from '~/core/ui/Button';
import ImageUploadInput from '~/core/ui/ImageUploadInput';
import SectionSeparator from '~/core/ui/SectionSeparator';
import FieldsSelect from './FieldsSelect';
import PromptInput from './PromptInput';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import useSupabase from '~/core/hooks/use-supabase';

import {
  createNewTemplateAction,
  updateTemplateAction,
  uploadTemplateImageAction,
} from '~/lib/templates/actions';

import type {
  ITemplate,
  ITemplateDraft,
  ITemplateForm,
} from '~/lib/templates/types';
import { getUnmatchedValues } from '~/core/generic/generic-utils';

type CreateTemplateFormProps = {
  defaultData: ITemplate | null;
  templateId: string;
};

function CreateTemplateForm({
  templateId,
  defaultData,
}: CreateTemplateFormProps) {
  const [pending, startTransition] = useTransition();
  const id = useId();

  const isNew = templateId === 'create';

  const csrfToken = useCsrfToken();

  const client = useSupabase();

  const {
    register,
    control,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ITemplateForm>({
    defaultValues: {
      title: isNew ? '' : defaultData?.title,
      description: isNew ? '' : defaultData?.description,
      category: isNew ? '' : defaultData?.category,
      image: isNew ? '' : defaultData?.image,
      prompt: isNew ? '' : defaultData?.prompt,
      fields: isNew ? [] : defaultData?.fields,
      isNew: isNew ? true : defaultData?.isNew,
    },
  });

  const titleControl = register('title', {
    required: 'Title is required',
  });

  const descriptionControl = register('description', {
    required: 'Description is required',
    minLength: {
      value: 50,
      message: 'Description must be at least 50 characters',
    },
    maxLength: {
      value: 200,
      message: 'Description must be at most 200 characters',
    },
  });

  const categoryControl = register('category', {
    required: 'Category is required',
    min: {
      value: 3,
      message: 'Category must be at least 3 characters',
    },
  });

  const promptRules = {
    required: 'Prompt is required',
    min: {
      value: 20,
      message: 'Prompt must be at least 20 characters',
    },
  };

  const imageRules = {
    required: 'Image is required',
  };

  const fieldsRules = {
    required: 'Fields is required',
    min: {
      value: 1,
      message: 'You have to select at least 1 field',
    },
  };

  // Submit handler
  const onSubmit = useCallback(
    (data: ITemplateForm) => {
      startTransition(async () => {
        try {
          const templateId = isNew ? id : defaultData?.id!;

          let image = getValues('image');
          let imageUrl = '';

          if (typeof image === 'string') {
            imageUrl = image;
          } else if (image instanceof File) {
            const formData = new FormData();
            formData.append('templateId', String(templateId));
            formData.append('image', image);
            formData.append('csrfToken', csrfToken);
            imageUrl = await uploadTemplateImageAction(formData);
          }
          const { fields, ...templateFormData } = data;
          const defaultFieldsIds = defaultData?.fields?.map((f) => f.id);
          const fieldsIds = fields.map((f) => f.id);

          if (isNew) {
            const templateData: ITemplateDraft = {
              ...templateFormData,
              id,
              fields: fieldsIds,
              image: imageUrl,
            };

            await createNewTemplateAction({ templateData, csrfToken });
          } else {
            const templateUpdates: Partial<ITemplateDraft> = getUnmatchedValues(
              {
                ...templateFormData,
                image: imageUrl,
              },
              defaultData,
            );

            const fieldsUpdates = getUnmatchedValues(
              { fields: fieldsIds },
              { fields: defaultFieldsIds },
            );

            if (!templateUpdates) {
              return;
            }

            console.log('updates : ', templateUpdates, fieldsUpdates);

            await updateTemplateAction({
              templateId,
              templateUpdates: {
                ...templateUpdates,
                ...fieldsUpdates,
              },
              csrfToken,
            });
          }

          toast.success(
            isNew
              ? 'Template Created Successfully'
              : 'Template Updated Successfully',
          );
        } catch (e: any) {
          console.error(e.message);
          toast.error('Failed to create template, Please try again.');
        }
      });
    },
    [csrfToken, defaultData, getValues, id, isNew],
  );

  console.log(getValues());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Heading className="text-gray-200" type={4}>
          Template Metadata
        </Heading>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField>
          <TextField.Label>
            <span>Title</span>
            <TextField.Hint>The name for the template</TextField.Hint>
            <TextField.Input placeholder="Title" {...titleControl} />
            <TextField.Error error={errors.title?.message} />
          </TextField.Label>
        </TextField>
        <TextField>
          <TextField.Label>
            <span>Description</span>
            <TextField.Hint>
              A summary explaining what the template is for
            </TextField.Hint>
            <Textarea placeholder="Description" {...descriptionControl} />
            <TextField.Error error={errors.description?.message} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <span>Category</span>
            <TextField.Hint>The template category</TextField.Hint>
            <TextField.Input placeholder="Category" {...categoryControl} />
            <TextField.Error error={errors.category?.message} />
          </TextField.Label>
        </TextField>

        <Controller
          control={control}
          name="image"
          rules={imageRules}
          render={({ field: { value, onChange, ...rest } }) => (
            <TextField>
              <TextField.Label>
                <span>Image</span>
                <TextField.Hint>
                  Feature image displayed with the template
                </TextField.Hint>
                <ImageUploadInput
                  {...rest}
                  placeholder="Image"
                  onChange={(event: React.FormEvent<HTMLInputElement>) =>
                    onChange(event.currentTarget.files?.[0])
                  }
                  onClear={() => onChange(null)}
                  image={
                    value instanceof File ? URL.createObjectURL(value) : value
                  }
                  multiple={false}
                />
                <TextField.Error error={errors.image?.message} />
              </TextField.Label>
            </TextField>
          )}
        />
      </div>

      <SectionSeparator />

      <div>
        <Heading type={4}>Prompt Values</Heading>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <Controller
          name="fields"
          control={control}
          rules={fieldsRules}
          render={({ field: { value, onChange, ...rest } }) => (
            <FieldsSelect
              className="w-full md:w-1/2"
              label="Fields"
              hint="Select input fields to include in this template"
              placeholder="Select Fields..."
              onChangeSelect={onChange}
              client={client}
              defaultValues={value}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="prompt"
          rules={promptRules}
          render={({ field: { onChange, ...rest } }) => (
            <TextField>
              <TextField.Label>Prompt</TextField.Label>
              <PromptInput
                placeholder="Prompt"
                fields={watch('fields')}
                onChange={onChange}
                {...rest}
              />
              <TextField.Error error={errors.prompt?.message} />
            </TextField>
          )}
        />
      </div>

      <div>
        <div className="flex justify-end gap-4 !mt-12">
          {/* <BackButton /> */}
          <div className="space-x-2">
            <Button type="submit" loading={pending}>
              {isNew ? 'Publish Template' : 'Update Template'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateTemplateForm;
