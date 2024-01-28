import { z } from 'zod';

import { templateFieldTypes } from '~/lib/fields/types';

export const getFieldSchema = () => {
  return z.object({
    type: z.enum(templateFieldTypes, {
      invalid_type_error: `Invalid field type, must be one of ${templateFieldTypes.join(
        ', ',
      )}`,
      required_error: 'Field type is required',
    }),
    name: z
      .string({
        invalid_type_error: 'Invalid Name type',
        required_error: 'Name is required',
      })
      .min(1),
    field_tag: z
      .string()
      .regex(/^[a-z][a-z0-9_-]*$/i)
      .transform((v) => v.toLowerCase())
      .describe(
        'Field tag must be lowercase with no spaces, only letters, numbers, underscores and dashes allowed',
      ),
    placeholder: z
      .string()
      .max(80, { message: 'Placeholder must be less than 80 characters' })
      .default(''),
    description: z.string().default(''),
    default_value: z.string().default(''),
    is_required: z.boolean({
      invalid_type_error: 'isRequired must be a true or false value',
      required_error: 'isRequired is a required field',
    }),
    options: z
      .array(z.string(), {
        invalid_type_error: 'Options must be an array of strings',
      })
      .default([]),
  });
};
