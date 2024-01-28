import React from 'react';

import { Card, CardContent, CardHeader } from '~/core/ui/Card';
import GenerationCard from './GenerationCard';
import If from '~/core/ui/If';

import { IGenerationCopy } from '~/lib/generations/types';

type PlaygroundProps = {
  data: IGenerationCopy[];
};

function Playground({ data }: PlaygroundProps) {
  console.log(data);

  return (
    <Card className="h-full bg-orange-50/50 dark:bg-gray-950">
      <CardHeader>Playground - {data.length}</CardHeader>
      <If condition={data.length === 0}>
        <CardContent className="text-center">
          Nothing Generated yet!
        </CardContent>
      </If>
      <CardContent className="space-y-4 p-4">
        {data.map((copy) => (
          <GenerationCard key={copy?.openai_id} data={copy} />
        ))}
      </CardContent>
    </Card>
  );
}

export default Playground;
