import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import ValueCard from '~/components/ValueCard';
import Button from '~/core/ui/Button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/core/ui/Collapsible';
import { ScrollArea } from '~/core/ui/ScrollArea';
import If from '~/core/ui/If';

type CollapsibleCardsProps = {
  onRemove: (index: number) => void;
  items: string[];
};

const CollapsibleCards = ({
  items: copiedItems,
  onRemove,
}: CollapsibleCardsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = [...copiedItems];
  const [firstItem] = items.splice(0, 1);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <ScrollArea className={clsx('mb-1', isOpen && 'h-36')}>
        {firstItem && (
          <ValueCard
            className="mb-1"
            label={firstItem}
            onRemove={() => onRemove(0)}
          />
        )}
        <CollapsibleContent className="space-y-1">
          {items.map((item, index) => (
            <ValueCard
              key={index}
              label={item}
              onRemove={() => onRemove(index + 1)}
            />
          ))}
        </CollapsibleContent>
      </ScrollArea>
      <If condition={items.length > 0}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-6"
          >
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </If>
    </Collapsible>
  );
};

export default CollapsibleCards;
