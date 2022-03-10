import { Component, JSX } from "solid-js";
import "./Message.css";

type MessageProps = JSX.IntrinsicElements["div"] & {
  type?: "normal" | "warning" | "error";
};

export const Message: Component<MessageProps> = ({
  children,
  className = "",
  type = "normal",
  ...rest
}) => {
  return (
    <div
      role="alert"
      className={`message ${className}`}
      classList={{ [type]: true }}
      {...rest}
    >
      {children}
    </div>
  );
};
