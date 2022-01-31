import { Component, JSX } from "solid-js";
import "./Loader.css";

type LoaderProps = JSX.IntrinsicElements["div"] & {
	size?: "tiny" | "small" | "normal" | "large" | "huge";
	dark?: boolean;
	inline?: boolean;
};

export const Loader: Component<LoaderProps> = ({
	size = "normal",
	inline,
	dark = true,
	className,
	classList,
	...rest
}) => {
	return (
		<div
			class={`spinner ${className ?? ""}`}
			classList={{ [size]: true, inline, dark, ...classList }}
			{...rest}
		></div>
	);
};
