import React from 'react';
import Spinner from '~/core/ui/Spinner';

function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full px-2 py-4">
      <Spinner />
    </div>
  );
}

export default Loading;
