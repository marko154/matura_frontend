import { Component, For } from "solid-js";
import {
  Select as HopeSelect,
  SelectTrigger,
  SelectPlaceholder,
  SelectValue,
  SelectTag,
  SelectTagCloseButton,
  SelectIcon,
  SelectContent,
  SelectListbox,
  SelectOptGroup,
  SelectLabel,
  SelectOption,
  SelectOptionText,
  SelectOptionIndicator,
} from "@hope-ui/solid";

type SelectProps = {
  options: { text: string; val: any }[];
  defaultValue?: any;
  onChange: (val: any) => void;
  placeholder?: string;
};

export const Select: Component<SelectProps> = ({
  options,
  defaultValue,
  onChange,
  placeholder,
}) => {
  return (
    <HopeSelect defaultValue={defaultValue} onChange={onChange}>
      <SelectTrigger>
        <SelectPlaceholder>{placeholder}</SelectPlaceholder>
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={options}>
            {(item) => (
              <SelectOption value={item.val}>
                <SelectOptionText>{item.text}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
        </SelectListbox>
      </SelectContent>
    </HopeSelect>
  );
};
