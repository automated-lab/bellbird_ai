import { Key } from 'swr';

const nullIfUndefined = (value: any) => (value ? value : null);

export const queryKeys = {
  fieldList: (page: number, perPage: number) => [
    'fieldList',
    nullIfUndefined(page),
    nullIfUndefined(perPage),
  ],
  templateList: (page: number, perPage: number) => [
    'templateList',
    nullIfUndefined(page),
    nullIfUndefined(perPage),
  ],
  templateRetrieve: (template_id: number) => ['template', template_id],
  userMe: ['user'],
  signUpWithEmailPassword: ['auth', 'sign-up-with-email-password'],
  resetPassword: ['auth', 'reset-password'],
  organizationUsageRetrieve: (organizationId: number) => [
    'organization-usage',
    organizationId,
  ],
  organizationCollectionsRetrieve: (organizationId: number) => [
    'organization-collections',
    organizationId,
  ],
  copyCollectionsRetrieve: (openai_id: string) => [
    'copy-collections',
    openai_id,
  ],
  collectionGenerationsRetrieve: (collection_id: number) => [
    'collection-generations',
    collection_id,
  ],
} as const;

export const getKeyIf = (key: Key, condition: boolean) =>
  condition ? key : null;
