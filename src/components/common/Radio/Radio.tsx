import { Component, JSX } from "solid-js";
import "./Radio.css";

type RadioProps = JSX.IntrinsicElements["label"] & {
  loading?: boolean;
  label?: string | JSX.Element;
  value: any;
  setValue?: (v: any) => void;
  name: string;
  checked?: boolean;
};

export const Radio: Component<RadioProps> = ({
  className = "",
  children,
  label = null,
  value,
  setValue = () => {},
  name,
  checked,
  ...props
}) => {
  const handleClick = () => {
    setValue(value);
  };

  return (
    <label className={"radio " + className} {...props}>
      <span class="outer">
        <input
          type="radio"
          class="opacity-0 absolute top-0 left-0"
          onClick={handleClick}
          name={name}
          checked={checked}
        />
        <span class="border-2 border-primary rounded-full h-min" style="padding: 3px;">
          <span
            class="inner rounded-full h-3 w-3 block"
            // classList={{ "bg-primary": value }}
          ></span>
        </span>
      </span>
      {label}
    </label>
  );
};
