'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';
import { IUserCollection } from '~/lib/user_collections/types';
import { deleteUserCollectionAction } from '~/lib/user_collections/actions';

function DeleteCollectionModal({
  collection,
}: React.PropsWithChildren<{
  collection: IUserCollection;
}>) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [pending, startTransition] = useTransition();
  const csrfToken = useCsrfToken();
  const displayText = collection.name ?? '';

  const onDismiss = () => {
    router.back();

    setIsOpen(false);
  };

  const onConfirm = () => {
    startTransition(async () => {
      await deleteUserCollectionAction({
        collectionId: collection.id,
        csrfToken,
      });

      onDismiss();
    });
  };

  return (
    <Modal
      heading={'Deleting Collection'}
      isOpen={isOpen}
      setIsOpen={onDismiss}
    >
      <form action={onConfirm}>
        <div className={'flex flex-col space-y-4'}>
          <div className={'flex flex-col space-y-2 text-sm'}>
            <p>
              You are about to delete <b>{displayText}</b> Collection.
            </p>

            <p>Delete this will also remove all the copies saved on it</p>

            <p>
              <b>This action is not reversible</b>.
            </p>

            <p>Are you sure you want to do this?</p>
          </div>

          <div>
            <TextFieldLabel>
              Confirm by typing <b>DELETE</b>
              <TextFieldInput required type={'text'} pattern={'DELETE'} />
            </TextFieldLabel>
          </div>

          <div className={'flex space-x-2.5 justify-end'}>
            <Modal.CancelButton
              type="button"
              disabled={pending}
              onClick={onDismiss}
            >
              Cancel
            </Modal.CancelButton>

            <Button type="submit" loading={pending} variant={'destructive'}>
              Yes, delete collection
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default DeleteCollectionModal;
