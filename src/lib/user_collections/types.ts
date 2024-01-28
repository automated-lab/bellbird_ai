import { IGenerationCopy } from '~/lib/generations/types';

export interface IUserCollection {
  id: number;
  user_id: string;
  name: string;
  generations_copies?: IGenerationCopy[];
}

export interface IUserCollectionDraft {
  user_id: string;
  name: string;
}
