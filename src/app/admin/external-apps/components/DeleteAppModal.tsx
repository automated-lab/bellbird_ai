'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';

import useCsrfToken from '~/core/hooks/use-csrf-token';
import { deleteAppAction } from '~/lib/external-apps/actions';
import { IExternalApp } from '~/lib/external-apps/types';

export const DeleteAppModal = ({
  children,
  app,
}: {
  app: IExternalApp;
  children: React.ReactElement;
}) => {
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const csrfToken = useCsrfToken();

  const onDismiss = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    startTransition(async () => {
      try {
        await deleteAppAction({
          appId: app.id,
          csrfToken,
        });

        toast.success(`App "${app.name}" deleted successfully`);
      } catch (error) {
        toast.error(`Failed to delete app "${app.name}"`);
      }
    });

    onDismiss();
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(true),
      })}

      <Modal
        heading={'Deleting External App'}
        isOpen={isOpen}
        setIsOpen={onDismiss}
      >
        <form action={onConfirm}>
          <div className={'flex flex-col space-y-4'}>
            <div className={'flex flex-col space-y-2 text-sm'}>
              <p>
                You are about to delete <b>{app.name}</b> app .
              </p>

              <p>This will prevent the app from creating new subscriptions</p>

              <p>
                <b>Be Careful, This action is not reversible</b>.
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
              <Modal.CancelButton disabled={pending} onClick={onDismiss}>
                Cancel
              </Modal.CancelButton>

              <Button loading={pending} variant={'destructive'}>
                Yes, delete app
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
