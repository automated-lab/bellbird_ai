export interface IGenerationCopy {
  id?: string;
  openai_id: string;
  user_id: string;
  organization_id: number;
  template_id: number;
  content: string;
  collection_id: number;
  created_at?: string;
}

export interface IGenerationCopyDraft {
  template_id: string;
  values: Record<string, string | string[]>;
}
