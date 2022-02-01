import { Component, JSX } from "solid-js";

type SidebarProps = JSX.IntrinsicElements["menu"] & {};

export const Sidebar: Component<SidebarProps> = ({
	children,
	className = "",
	...rest
}) => {
	return (
		<section className={`w-96 flex-0 bg-light-blue ${className}`} {...rest}>
			{children}
		</section>
	);
};
