import useSWRMutation from 'swr/mutation';
import useApiRequest from '~/core/hooks/use-api';
import { IGenerationCopy } from '~/lib/generations/types';

interface GenerateCopyBody {
  values: Record<string, string | string[]>;
  template_id: number;
  organization_id: number;
}

export const useGenerateCopy = () => {
  const fetcher = useApiRequest<IGenerationCopy, GenerateCopyBody>();

  const path = '/api/generate';
  const generateCopy = useSWRMutation(
    path,
    async (_, data: { arg: GenerateCopyBody }) =>
      await fetcher({ path: '/api/generate', body: data.arg, method: 'POST' }),
  );

  return generateCopy;
};
