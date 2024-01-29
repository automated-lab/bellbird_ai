import { IGenerationCopy } from '~/lib/generations/types';

export interface IUserCollection {
  id: number;
  organization_id: number;
  user_id: string;
  name: string;
  generations_copies?: IGenerationCopy[];
}

export interface IUserCollectionDraft {
  organization_id: number;
  user_id: string;
  name: string;
}
