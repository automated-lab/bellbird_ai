export interface IGenerationCopy {
  id?: string;
  openai_id: string;
  user_id: string;
  organization_id: string;
  template_id: string;
  content: string;
  collection_id: string;
  created_at?: string;
}

export interface IGenerationCopyDraft {
  template_id: string;
  values: Record<string, string | string[]>;
}
