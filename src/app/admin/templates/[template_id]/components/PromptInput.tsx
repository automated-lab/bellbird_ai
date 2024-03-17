import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Textarea from '~/core/ui/Textarea';

import type { TField } from '~/lib/fields/types';

type PromptInputProps = {
  fields: TField[];
  onChange: (value: string) => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const PromptInput = React.forwardRef(
  (
    { fields = [], onChange, ...rest }: PromptInputProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const [value, setValue] = useState<string>(rest.value as string);
    const [currentPosition, setCurrentPosition] = useState(0);

    const prevFieldsRef = useRef<TField[]>(fields || []);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleAttachField = (field: TField) => {
      setValue((prev) => {
        const content = [
          prev.substring(0, currentPosition),
          '',
          prev.substring(currentPosition),
        ];

        content[1] = `{{${field.field_tag}}}`;

        return content.join('');
      });

      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(0, currentPosition);
    };

    useEffect(() => {
      onChange(value);
    }, [value, setValue, onChange]);

    useEffect(() => {
      if (prevFieldsRef.current.length > fields.length) {
        const prevFields = prevFieldsRef.current.map((f) => f.field_tag);
        const nextFields = fields.map((f) => f.field_tag);

        const removed = [...prevFields].filter((f) => !nextFields.includes(f));

        const filtered = value.replace(
          new RegExp(`{{(${removed.join('|')})}\\s*}`, 'g'),
          '',
        );

        setValue(filtered);
      }
    }, [fields, value]);

    useEffect(() => {
      prevFieldsRef.current = fields;
    }, [fields]);

    useImperativeHandle(ref, () => textareaRef.current!, []);

    return (
      <div className="w-full space-y-2">
        <div className="flex gap-1">
          <If condition={fields.length < 1}>
            <p className="text-gray-400">No Field is selected..</p>
          </If>
          {fields.map((field) => (
            <Button
              variant="outline"
              size="sm"
              type="button"
              round
              key={field.id}
              onClick={() => handleAttachField(field)}
            >
              {field.name}
            </Button>
          ))}
        </div>
        <div>
          <Textarea
            {...rest}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setCurrentPosition(e.target.selectionStart);
              setValue(e.target.value);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLTextAreaElement>) => {
              setCurrentPosition(e.currentTarget.selectionEnd);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              setCurrentPosition(e.currentTarget.selectionEnd);
            }}
            className="h-max"
            ref={textareaRef}
          />
        </div>
      </div>
    );
  },
);

PromptInput.displayName = 'PromptInput';

export default PromptInput;
