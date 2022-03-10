import { Component, JSX } from "solid-js";
import { generateUniqueID } from "../../../utils/uniqueID.utils";
import "./TextArea.css";

type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
  label?: string;
  version?: "primary" | "secondary";
};

export const TextArea: Component<TextAreaProps> = ({
  label,
  id = generateUniqueID(),
  className = "",
  version = "primary",
  ...rest
}) => {
  return (
    <div className={`textarea w-full ${className}`} classList={{ [version]: true }}>
      <div>
        {label && (
          <label className="ml-1 text-sm" for={id}>
            {label}
          </label>
        )}
      </div>
      <textarea class="" {...rest} id={id}></textarea>
    </div>
  );
};
