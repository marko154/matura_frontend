import { Component } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = {
	open: boolean;
};

export const Modal: Component<ModalProps> = ({ open, children }) => {
	return (
		<Portal>
			<div
				className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded-lg shadow-lg"
				classList={{ hidden: !open }}
			>
				<div className="p-8">{children}</div>
			</div>
		</Portal>
	);
};
