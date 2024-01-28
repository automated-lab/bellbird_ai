'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Plans from '~/components/Plans';

import Modal from '~/core/ui/Modal';
import useSupabase from '~/core/hooks/use-supabase';

function UpgradePlanModal() {
  const client = useSupabase();

  const router = useRouter();
  const [isMounted, setMounted] = useState(false);

  const [isOpen, setIsOpen] = useState(true);

  const onDimiss = () => {
    setIsOpen(false);

    router.back();
  };

  useEffect(() => {
    setMounted(true);
    console.log('its opened!');
  }, []);

  if (!isMounted) return;

  return (
    <Modal heading="Upgrade Plan" isOpen={isOpen} setIsOpen={onDimiss}>
      <Plans client={client} />
    </Modal>
  );
}

export default UpgradePlanModal;
