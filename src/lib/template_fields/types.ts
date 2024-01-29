export interface ITemplateFields {
  id: number;
  template_id: number;
  field_id: number;
}

export interface ITemplateFieldsDraft extends Omit<ITemplateFields, 'id'> {}
