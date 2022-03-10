import { Component, JSX } from "solid-js";

type CheckboxProps = JSX.IntrinsicElements["input"] & {
  loading?: boolean;
};

export const Checkbox: Component<CheckboxProps> = ({ className = "", ...rest }) => {
  return <input type="checkbox" className={"h-4 w-4" + className} {...rest}></input>;
};
