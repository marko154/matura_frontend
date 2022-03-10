import { Component, JSX } from "solid-js";

type IconProps = JSX.IntrinsicElements["span"] & {
  name: string;
  size?:
    | "text-xs"
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | "text-3xl"
    | "text-4xl"
    | "text-5xl"
    | "text-6xl"
    | "text-7xl"
    | "text-8xl"
    | "text-9xl";
};

export const Icon: Component<IconProps> = ({
  name,
  size = "text-base",
  className = "",
  ...rest
}) => {
  return (
    <span
      className={`material-icons-round ${className}`}
      classList={{ [size]: true }}
      {...rest}
    >
      {name}
    </span>
  );
};
