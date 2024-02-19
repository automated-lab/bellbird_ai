import React from 'react';
import { toast } from 'sonner';

import Button from '~/core/ui/Button';
import Tile from '~/core/ui/Tile';
import GenerationSaveButton from '~/components/GenerationSaveButton';
import Truncate from '~/components/Truncate';

import type { IGenerationCopy } from '~/lib/generations/types';

type GenerationCardProps = {
  data: IGenerationCopy;
};

function GenerationCard({ data }: GenerationCardProps) {
  const onCopy = () => {
    navigator.clipboard.writeText(data!.content);
    toast.success('content copied successfully!');
  };

  return (
    <Tile className="group relative rounded-md">
      <Tile.Body>
        {/* <Truncate text={data?.content} length={150}> */}
        <Truncate text={data?.content} length={200} />
        {/* </Truncate> */}
      </Tile.Body>
      <div className="absolute bottom-0 right-0 flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition duration-75">
        <Button
          className="[&>*]:py-1 [&>*]:px-2"
          onClick={onCopy}
          variant="outline"
          size="sm"
        >
          copy
        </Button>
        <GenerationSaveButton generationCopy={data} />
      </div>
    </Tile>
  );
}

export default GenerationCard;
