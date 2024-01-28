'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';

import { deleteTemplateAction } from '~/lib/templates/actions';
import useCsrfToken from '~/core/hooks/use-csrf-token';

import type { ITemplate } from '~/lib/templates/types';

function DeleteTemplateModal({
  template,
}: React.PropsWithChildren<{
  template: ITemplate;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [pending, startTransition] = useTransition();
  const csrfToken = useCsrfToken();
  const displayText = template.title ?? '';

  const onDismiss = () => {
    router.back();

    setIsOpen(false);
  };

  const onConfirm = () => {
    startTransition(async () => {
      await deleteTemplateAction({
        templateId: template.id!,
        csrfToken,
      });

      onDismiss();
    });
  };

  return (
    <Modal heading={'Deleting Template'} isOpen={isOpen} setIsOpen={onDismiss}>
      <form action={onConfirm}>
        <div className={'flex flex-col space-y-4'}>
          <div className={'flex flex-col space-y-2 text-sm'}>
            <p>
              You are about to delete the template <b>{displayText}</b>.
            </p>

            <p>
              Delete this will also remove it from the templates that&apos;s
              used on
            </p>

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
            <Modal.CancelButton disabled={pending} onClick={onDismiss}>
              Cancel
            </Modal.CancelButton>

            <Button loading={pending} variant={'destructive'}>
              Yes, delete template
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default DeleteTemplateModal;
