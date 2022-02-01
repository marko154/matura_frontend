import { Component, JSX } from "solid-js";

type MainWrapperProps = JSX.IntrinsicElements["main"] & {
	title?: string;
};

export const MainWrapper: Component<MainWrapperProps> = ({
	title,
	children,
	...rest
}) => {
	return (
		<main className="flex flex-col flex-1 relative mx-12" {...rest}>
			{title && <h1 className="text-3xl my-6 text-gray-700">{title}</h1>}
			{children}
		</main>
	);
};
