import { Component, JSX } from "solid-js";

type AvatarProps = JSX.IntrinsicElements["img"] & {
  imageURL: string | undefined;
  size?: string;
};

export const Avatar: Component<AvatarProps> = ({
  imageURL,
  className = "",
  size = "h-12 w-12",
  ...rest
}) => {
  return (
    <img
      src={imageURL ?? "https://i.pravatar.cc/64"}
      className={`inline object-cover ${size} rounded-full ${className}`}
      alt="profile image"
      {...rest}
    />
  );
};
