import { Component, JSX } from "solid-js";

type SelectProps = JSX.IntrinsicElements["select"] & {};

export const Select: Component<SelectProps> = ({ ...rest }) => {
	return <select {...rest}></select>;
};
