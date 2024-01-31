'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Plans from '~/components/Plans';
import Modal from '~/core/ui/Modal';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

function UpgradePlanModal() {
  const organization = useCurrentOrganization();

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);

  const onDimiss = () => {
    setIsOpen(false);

    router.back();
  };

  return (
    <Modal heading="Upgrade Plan" isOpen={isOpen} setIsOpen={onDimiss}>
      <Plans organization={organization} />
    </Modal>
  );
}

export default UpgradePlanModal;
