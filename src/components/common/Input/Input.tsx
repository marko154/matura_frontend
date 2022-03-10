import type { Component, JSX } from "solid-js";
import { generateUniqueID } from "../../../utils/uniqueID.utils";
import { Icon } from "../Icon";
import { Loader } from "../Loader/Loader";
import "./Input.css";

type InputProps = JSX.IntrinsicElements["input"] & {
  label?: string;
  error?: boolean;
  warning?: boolean;
  version?: "primary" | "secondary";
  loading?: boolean;
  icon?: string;
};

export const Input: Component<InputProps> = ({
  label,
  id = generateUniqueID(),
  className = "",
  version = "primary",
  error,
  warning,
  icon,
  loading,
  ...rest
}) => {
  return (
    <div
      className={`w-full ${className}`}
      classList={{ error, warning, [version]: true }}
    >
      <div>
        {label && (
          <label className="text-primary ml-1 text-sm" for={id}>
            {label}
          </label>
        )}
      </div>
      <div className="relative">
        <input className="input" id={id} {...rest} />
        {loading && (
          <Loader
            size="tiny"
            className="inset-auto right-1 text"
            style="top: 50%; tranform: translateY(-50%);"
          />
        )}
        {!loading && icon && (
          <Icon className="absolute right-3 top-1" size="text-2xl" name={icon} />
        )}
      </div>
    </div>
  );
};
