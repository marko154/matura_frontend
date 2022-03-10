import { Component, createMemo, JSX } from "solid-js";
import { Loader } from "../Loader/Loader";
import "./Button.css";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  action?: "primary" | "google" | "secondary";
  loading?: boolean;
};

const Button: Component<ButtonProps> = ({
  action = "primary",
  loading,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={"button " + className}
      classList={{
        [action]: true,
        loading,
      }}
      {...props}
    >
      {loading && <Loader size="tiny" dark={action !== "primary"} />}
      {children}
    </button>
  );
};

export { Button };
