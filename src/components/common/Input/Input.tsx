import type { Component, JSX } from "solid-js";
import { generateUniqueID } from "../../../utils/uniqueID.utils";
import { Icon } from "../Icon";
import "./Input.css";

type InputProps = JSX.IntrinsicElements["input"] & {
	label?: string;
};

export const Input: Component<InputProps> = ({
	label,
	id = generateUniqueID(),
	...rest
}) => {
	return (
		<div className="w-full">
			<div>
				{label && (
					<label className="text-primary ml-1 text-sm" for={id}>
						{label}
					</label>
				)}
			</div>
			<input className="input" id={id} {...rest} />
		</div>
	);
};
