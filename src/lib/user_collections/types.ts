import { IGenerationCopy } from '~/lib/generations/types';

export interface ICopyCollection {
  id: number;
  organization_id: number;
  user_id: string;
  name: string;
  generations_copies?: IGenerationCopy[];
}

export interface ICopyCollectionDraft {
  organization_id: number;
  user_id: string;
  name: string;
}
