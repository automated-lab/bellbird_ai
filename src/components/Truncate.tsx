import React, { useState } from 'react';
import _truncate from 'lodash/truncate';
import Markdown from 'react-markdown';

import Button from '~/core/ui/Button';

interface TruncateProps {
  text: string;
  length: number;
  defaultExpanded?: boolean;
  omission?: string;
  isMarkdown?: boolean;
}

const Truncate: React.FC<TruncateProps> = ({
  text,
  length,
  defaultExpanded = false,
  isMarkdown = false,
  omission = '...',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false);

  const truncatedText = _truncate(text, {
    length: isExpanded ? text.length : length,
    omission,
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Markdown className="whitespace-pre-wrap">{truncatedText}</Markdown>
      {!isExpanded && text.length > length && (
        <Button variant="link" compact size="small" onClick={toggleExpand}>
          Show more
        </Button>
      )}
      {isExpanded && (
        <Button variant="link" compact size="small" onClick={toggleExpand}>
          Hide
        </Button>
      )}
    </div>
  );
};

export default Truncate;
