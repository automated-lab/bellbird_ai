'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Close as DialogPrimitiveClose } from '@radix-ui/react-dialog';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';
import Trans from '~/core/ui/Trans';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/core/ui/Dialog';

type ControlledOpenProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
};

type TriggerProps = {
  Trigger?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => unknown;
};

type Props = React.PropsWithChildren<
  {
    heading: string | React.ReactNode;
    closeButton?: boolean;
  } & (ControlledOpenProps | TriggerProps)
>;

const DialogWrapper = (wrapperProps: {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  useCloseButton: boolean;
  children: React.ReactNode;
}) => {
  const isControlled = ('isOpen' in wrapperProps) as boolean;

  return isControlled ? (
    <Dialog
      open={wrapperProps.isOpen}
      onOpenChange={(open) => {
        if (wrapperProps.useCloseButton && wrapperProps.setIsOpen && !open) {
          wrapperProps.setIsOpen(false);
        }
      }}
    >
      {wrapperProps.children}
    </Dialog>
  ) : (
    <Dialog>{wrapperProps.children}</Dialog>
  );
};

const Modal: React.FC<Props> & {
  CancelButton: typeof CancelButton;
} = ({ closeButton, heading, children, ...props }) => {
  const useCloseButton = closeButton ?? true;
  const Trigger = ('Trigger' in props && props.Trigger) || null;

  return (
    <DialogWrapper useCloseButton={useCloseButton} {...props}>
      <If condition={Trigger}>
        <DialogTrigger asChild onClick={() => props.setIsOpen?.(true)}>
          {Trigger}
        </DialogTrigger>
      </If>

      <DialogContent asChild>
        <div className={'flex flex-col space-y-4'}>
          <div className="flex items-center">
            <DialogTitle className="flex w-full text-xl font-semibold text-current">
              <span className={'max-w-[90%] truncate'}>{heading}</span>
            </DialogTitle>
          </div>

          <div className="relative">{children}</div>

          <If condition={useCloseButton}>
            <DialogPrimitiveClose asChild>
              <IconButton
                className={'absolute top-0 right-4 flex items-center'}
                label={'Close Modal'}
                type="button"
              >
                <XMarkIcon className={'h-6'} />
                <span className="sr-only">Close</span>
              </IconButton>
            </DialogPrimitiveClose>
          </If>
        </div>
      </DialogContent>
    </DialogWrapper>
  );
};

export default Modal;

function CancelButton<Props extends React.ButtonHTMLAttributes<unknown>>(
  props: Props,
) {
  return (
    <Button
      type={'button'}
      data-cy={'close-modal-button'}
      variant={'ghost'}
      {...props}
    >
      <Trans i18nKey={'common:cancel'} />
    </Button>
  );
}

Modal.CancelButton = CancelButton;

export { CancelButton };
