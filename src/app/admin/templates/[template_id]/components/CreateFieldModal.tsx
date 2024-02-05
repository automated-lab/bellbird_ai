import React, { useState } from 'react';
import FieldForm from '~/app/admin/fields/[field_id]/components/FieldForm';
import Modal from '~/core/ui/Modal';

interface CreateFieldModalProps {
  children: React.ReactNode;
}

const CreateFieldModal = ({ children }: CreateFieldModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      heading="Create New Field"
      closeButton
      Trigger={children}
    >
      <div className="w-fit max-w-screen-lg">
        <FieldForm
          defaultData={null}
          isNew
          onSuccess={() => setIsOpen(false)}
        />
      </div>
    </Modal>
  );
};

export default CreateFieldModal;
