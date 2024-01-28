import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '~/core/ui/Select';

type ToolInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: string[];
  onChange: (value: string) => void;
};

const SelectField = React.forwardRef(
  (
    { options = [], value, onChange, ...rest }: ToolInputProps,
    ref: React.ForwardedRef<HTMLSelectElement>,
  ) => {
    return (
      <Select value={value as string} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue {...rest} ref={ref} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);

SelectField.displayName = 'SelectField';

export default SelectField;
