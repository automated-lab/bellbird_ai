export interface ITemplateFields {
  id: number;
  template_id: string;
  field_id: number;
}

export interface ITemplateFieldsDraft extends Omit<ITemplateFields, 'id'> {}
