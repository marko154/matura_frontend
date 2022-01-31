import { Component, JSX } from "solid-js";

type SidebarProps = JSX.IntrinsicElements["menu"] & {};

export const Sidebar: Component<SidebarProps> = ({ children, ...rest }) => {
	return <main {...rest}>{children}</main>;
};
