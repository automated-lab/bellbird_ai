import React, { ChangeEvent, useState } from 'react';
import TextField from '~/core/ui/TextField';

type OptionsInputProps = React.InputHTMLAttributes<unknown> & {
  options: string[];
  onChange: (value: string[]) => void;
};

const OptionsInput = React.forwardRef<
  React.ElementRef<'input'>,
  OptionsInputProps
>(({ options = [], onChange, ...props }, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const content = e.currentTarget.value;
    if (content.endsWith(',')) {
      if (content.length > 1) {
        onChange?.([content.slice(0, -1), ...options]);
      }
      e.target.value = '';
    }
  };

  return <TextField.Input onChange={handleChange} {...props} ref={ref} />;
});

OptionsInput.displayName = 'OptionsInput';

export default OptionsInput;
