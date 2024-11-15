export const templateFieldTypes = ['text', 'textarea', 'select'] as const;

export interface ITemplateField {
  id: number;
  name: string;
  type: (typeof templateFieldTypes)[number];
  field_tag: string;
  description: string;
  placeholder?: string;
  default_value?: string;
  options?: string[];
  is_required: boolean;
}

export interface ITemplateFieldForm extends Omit<ITemplateField, 'id'> {}

// Field Representation in Select Input
export type TField = { id: number; name: string; field_tag: string };
