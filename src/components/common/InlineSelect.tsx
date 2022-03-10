import { Component, createSignal, For, JSX } from "solid-js";

type InlineSelectProps = JSX.IntrinsicElements["div"] & {
  options: { content: string | JSX.Element; value: any }[];
  onSelect: (value: any) => void;
};

const selectedClasses =
  "bg-gray-200 border-b-primary text-primary focus:ring focus:ring-blue-100";

export const InlineSelect: Component<InlineSelectProps> = ({
  options,
  onSelect,
  className = "",
  ...rest
}) => {
  const [selected, setSelected] = createSignal(0);
  const handleSelect = (idx: number) => {
    setSelected(idx);
    onSelect(options[selected()].value);
  };

  return (
    <div className={`flex bg-gray-100 text-gray-600 rounded-md ${className}`} {...rest}>
      <For each={options}>
        {(option, idx) => (
          <button
            onClick={() => handleSelect(idx())}
            className="px-4 py-2 first:rounded-l-md last:rounded-r-md transition-colors hover:text-black hover:bg-gray-200 border border-gray-300 border-b-2 border-r-0 last:border-r"
            classList={{ [selectedClasses]: idx() === selected() }}
          >
            {option.content}
          </button>
        )}
      </For>
    </div>
  );
};
