import { Component, JSX } from "solid-js";
import { generateUniqueID } from "../../utils/uniqueID.utils";

type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
	label?: string;
};

export const TextArea: Component<TextAreaProps> = ({
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
			<textarea
				class="border border-primary w-full rounded-md h-24 focus:ring outline-none px-3 py-2"
				{...rest}
				id={id}
			></textarea>
		</div>
	);
};
