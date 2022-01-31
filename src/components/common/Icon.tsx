import { Component, JSX } from "solid-js";

type IconProps = JSX.IntrinsicElements["span"] & {
	name: string;
};

export const Icon: Component<IconProps> = ({
	name,
	className = "",
	...rest
}) => {
	return (
		<span
			className={`material-icons-round text-base ${className}`}
			{...rest}
		>
			{name}
		</span>
	);
};
