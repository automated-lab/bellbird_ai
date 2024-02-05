import { ITemplateField, TField } from '~/lib/fields/types';

export interface ITemplate {
  id: string;
  title: string;
  description: string;
  image: string; // url
  category: string;
  prompt?: string;
  fields?: ITemplateField[] | TField[];
  isNew: boolean;
}

export interface ITemplateDraft
  extends Omit<ITemplate, 'id' | 'image' | 'fields'> {
  id?: string;
  image: string;
  fields: number[];
}

export interface ITemplateForm
  extends Omit<ITemplate, 'id' | 'image' | 'fields'> {
  image: string | File;
  fields: { id: number; name: string; field_tag: string }[];
}
