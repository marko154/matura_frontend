import { Component, JSX } from "solid-js";

type AvatarProps = JSX.IntrinsicElements["img"] & {
	imageURL: string | undefined;
};

export const Avatar: Component<AvatarProps> = ({ imageURL, ...rest }) => {
	return (
		<img
			src={imageURL ?? "https://i.pravatar.cc/64"}
			className="inline object-cover w-12 h-12 mr-2 rounded-full"
			alt="profile image"
			{...rest}
		/>
	);
};
