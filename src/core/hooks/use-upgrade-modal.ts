'use client';

import { useRouter } from 'next/navigation';

export const useUpgradeModal = () => {
  const router = useRouter();

  const open = () => {
    router.push(`/dashboard/upgrade`);
  };

  return {
    open,
  };
};
