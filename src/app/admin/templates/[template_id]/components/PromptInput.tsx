import React, { useEffect, useRef, useState } from 'react';

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
    const [value, setValue] = useState(rest.value as string);

    const prevFieldsRef = useRef<TField[]>(fields || []);

    useEffect(() => {
      prevFieldsRef.current = fields;
      onChange(value);
    }, [value, setValue, fields, onChange]);

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
              onClick={() => {
                setValue((prev: string) =>
                  prev.concat(`{{${field.field_tag}}} `),
                );
              }}
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
              setValue(e.target.value);
            }}
            className="h-max"
            ref={ref}
          />
        </div>
      </div>
    );
  },
);

PromptInput.displayName = 'PromptInput';

export default PromptInput;
