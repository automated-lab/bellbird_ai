import React from 'react';
import Button from '~/core/ui/Button';

type PagePagination = {
  path: string;
  currentPage: number;
  pageCount: number;
};

function PagePagination({ path, currentPage, pageCount }: PagePagination) {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="outline"
        size="small"
        href={`${path}?page=${currentPage - 1}`}
        disabled={currentPage === 1}
      >
        Prev Page
      </Button>
      <Button
        variant="outline"
        size="small"
        href={`${path}?page=${currentPage + 1}`}
        disabled={currentPage === pageCount}
      >
        Next Page
      </Button>
    </div>
  );
}

export default PagePagination;
