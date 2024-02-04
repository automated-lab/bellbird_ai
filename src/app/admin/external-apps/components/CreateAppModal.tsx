'use client';

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@radix-ui/react-dialog';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import Button from '~/core/ui/Button';
import IconButton from '~/core/ui/IconButton';
import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import { createNewAppAction } from '~/lib/external-apps/actions';

import type { IExternalAppDraft } from '~/lib/external-apps/types';

export const CreateAppModal = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [secret, setSecret] = useState('');

  const csrfToken = useCsrfToken();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IExternalAppDraft>({
    defaultValues: {
      appName: '',
    },
  });

  const appNameControl = register('appName', {
    min: {
      value: 2,
      message: 'App name must be at least 3 characters',
    },
  });

  const onDismiss = () => {
    setIsOpen(false);
  };

  const onConfirm = ({ appName }: IExternalAppDraft) => {
    startTransition(async () => {
      try {
        const secret = await createNewAppAction({
          appName: appName,
          csrfToken,
        });

        setSecret(secret);

        toast.success('Secret key generated successfully');
      } catch (error: unknown) {
        toast.error('Error occured while generating the secret key');
      }
    });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);

    toast.success('Secret copied to clipboard');
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(`secret: ${secret};
    email: '';
    plan: ''; // write the name of the plan here : Ex. Pro
    duration_in_months: '' // How long the free subscription will stay
    `);

    toast.success('Secret copied to clipboard');
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(true),
      })}

      <Modal heading="Create New App" isOpen={isOpen} setIsOpen={setIsOpen}>
        {!secret ? (
          <form onSubmit={handleSubmit(onConfirm)}>
            <div className="mb-8">
              <TextField>
                <TextField.Label>
                  <span>App Name</span>
                  <TextField.Hint>The name of the app</TextField.Hint>
                  <TextField.Input
                    placeholder="Ex. Charm"
                    {...appNameControl}
                  />
                  <TextField.Error error={errors.appName?.message} />
                </TextField.Label>
              </TextField>
            </div>

            <div className="flex justify-end gap-2">
              <Modal.CancelButton onClick={onDismiss}>
                Cancel
              </Modal.CancelButton>
              <Button type="submit" loading={pending}>
                Publish App
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <p className="mb-2">Here your secret key:</p>

            <div className="flex items-center gap-4 truncate border rounded-md p-2">
              <pre className="max-w-96 text-ellipsis overflow-x-hidden">
                {secret}
              </pre>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCopySecret}
                    variant="outline"
                    size="icon"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to Clipboard</TooltipContent>
              </Tooltip>
            </div>

            <div className="w-full overflow-x-hidden">
              <p className="mt-2 mb-1">Here is the schema of the payload:</p>

              <pre className="overflow-x-auto">
                {`secret: HERE IS THE SECRET;
email: '';
plan: ''; // write the name of the plan here : Ex. Pro
duration_in_months: '' // How long the free subscription will stay
`}
              </pre>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCopySchema}
                    variant="outline"
                    size="icon"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to Clipboard</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex justify-end mt-2">
              <Button onClick={onDismiss}>Okay</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
