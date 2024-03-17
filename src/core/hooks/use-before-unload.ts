'use client';

import { useEffect } from 'react';

/**
 * @name useBeforeUnload
 * @description Hook that alerts to confirm page reload
 */
export const useBeforeUnload = () => {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return 'Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);
};
