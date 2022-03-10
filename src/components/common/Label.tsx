import { Component, JSX } from "solid-js";

type LabelProps = JSX.IntrinsicElements["div"] & {};

export const Label: Component<LabelProps> = ({ className = "", ...rest }) => (
  <div
    className={`${className}`}
    class="rounded bg-primary px-3 py-1 text-white text-sm whitespace-nowrap h-min"
    {...rest}
  ></div>
);
