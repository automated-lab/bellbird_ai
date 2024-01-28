export interface ITemplateFields {
  id: string;
  template_id: string;
  field_id: string;
}

export interface ITemplateFieldsDraft extends Omit<ITemplateFields, 'id'> {}
