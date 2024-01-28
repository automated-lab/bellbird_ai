import React, { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import useSWR from 'swr';
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/core/ui/Command';
import TextField from '~/core/ui/TextField';
import { Popover, PopoverContent, PopoverTrigger } from '~/core/ui/Popover';
import Button, { ButtonProps } from '~/core/ui/Button';
import ValueCard from '~/components/ValueCard';
import Loading from '~/components/Loading';

import { cn } from '~/core/generic/shadcn-utils';
import { getFields } from '~/lib/fields/queries';
import { Database } from '~/database.types';
import { queryKeys } from '~/lib/query-keys';

import type { TField } from '~/lib/fields/types';
import If from '~/core/ui/If';
import CreateFieldModal from './CreateFieldModal';
import IconButton from '~/core/ui/IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

type Client = SupabaseClient<Database>;

type MultiSelectProps = ButtonProps & {
  defaultValues?: TField[];
  label: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  loading?: boolean;
  client: Client;
  onChangeSelect: (data: TField[]) => void;
};

// Component
const FieldsSelect = React.forwardRef(
  (
    {
      label,
      placeholder,
      hint,
      defaultValues = [],
      className = '',
      onChangeSelect,
      client,
      ...props
    }: MultiSelectProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    // State and SWR hook
    const [open, setOpen] = React.useState(false);
    const [showCreateField, setShowCreateField] = useState(false);
    const [selectedValues, setSelectedValues] = React.useState<TField[]>(
      defaultValues || [],
    );
    console.log(defaultValues, selectedValues);

    const { data, isLoading } = useSWR(
      queryKeys.fieldList,
      async () =>
        await getFields(client, 'id, field_tag, name')
          .throwOnError()
          .then(({ data }) => data ?? []),
      {},
    );

    // Handlers
    const addValue = (newValue: TField) => {
      const isSelected =
        selectedValues.findIndex(
          (selected) => selected.field_tag === newValue.field_tag,
        ) >= 0;
      if (isSelected) return;

      const newValues = [...selectedValues, newValue];
      setSelectedValues(newValues);
    };

    const onRemove = (val: string) => {
      const newValues = selectedValues.filter(
        ({ field_tag: selectedValue }) => selectedValue !== val,
      );
      setSelectedValues(newValues);
    };

    // Effect for onChangeSelect
    useEffect(() => {
      onChangeSelect(selectedValues);
    }, [selectedValues, onChangeSelect]);

    return (
      <>
        <TextField className={className}>
          <TextField.Label>{label}</TextField.Label>
          <TextField.Hint>{hint}</TextField.Hint>
          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex gap-2">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full"
                  {...props}
                >
                  <div
                    ref={ref}
                    className="w-full flex justify-between items-center text-gray-500 dark:text-gray-400"
                  >
                    <span>{placeholder}</span>
                    <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => setShowCreateField(true)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create new field</TooltipContent>
              </Tooltip>
            </div>

            <PopoverContent className="w-[400px] max-w-[80vw] p-0">
              <Command>
                <CommandInput placeholder="Search fields..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? <Loading /> : <span>No field found.</span>}
                  </CommandEmpty>
                  <CommandGroup>
                    {data?.map((item) => (
                      <CommandItem
                        key={item.field_tag}
                        value={[item.name, item.field_tag].join(' ')}
                        onSelect={() => {
                          addValue(item);
                          setOpen(false);
                        }}
                      >
                        <div>
                          <p>{item.name}</p>
                          <span className="text-gray-400 dark:text-gray-500">
                            {item.field_tag}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedValues.find(
                              (val) => val.field_tag === item.field_tag,
                            )
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="w-full space-y-1">
            {selectedValues.map(({ name, field_tag }) => (
              <ValueCard
                key={field_tag}
                onRemove={() => onRemove(field_tag)}
                label={name}
              />
            ))}
          </div>
        </TextField>

        <CreateFieldModal
          isOpen={showCreateField}
          onChange={setShowCreateField}
        />
      </>
    );
  },
);

FieldsSelect.displayName = 'FieldsSelect';

export default FieldsSelect;
