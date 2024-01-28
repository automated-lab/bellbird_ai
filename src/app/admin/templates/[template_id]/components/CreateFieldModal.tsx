import React from 'react';
import FieldForm from '~/app/admin/fields/[field_id]/components/FieldForm';
import Modal from '~/core/ui/Modal';

interface CreateFieldModalProps {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
}

const CreateFieldModal = ({ isOpen, onChange }: CreateFieldModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={onChange}
      heading="Create New Field"
      closeButton
    >
      <div className="w-[90vw] max-w-screen-lg">
        <FieldForm defaultData={null} isNew onSuccess={() => onChange(false)} />
      </div>
    </Modal>
  );
};

export default CreateFieldModal;
