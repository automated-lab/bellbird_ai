export interface IGenerationCopy {
  id?: number;
  openai_id: string;
  user_id: string;
  organization_id: number;
  template_id: string | null;
  content: string;
  collection_id: number;
  created_at?: string;
}

export interface IGenerationCopyDraft {
  template_id: string;
  values: Record<string, string | string[]>;
}
