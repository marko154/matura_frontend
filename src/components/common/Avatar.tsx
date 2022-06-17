import { Component, JSX } from "solid-js";

type AvatarProps = JSX.IntrinsicElements["img"] & {
  imageURL: string | undefined;
  size?: string;
};

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
// const DEFAULT_AVATAR = "https://i.pravatar.cc/64"

export const Avatar: Component<AvatarProps> = ({
  imageURL,
  className = "",
  size = "h-12 w-12",
  ...rest
}) => {
  return (
    <img
      src={imageURL ?? DEFAULT_AVATAR}
      className={`inline object-cover ${size} rounded-full ${className}`}
      alt="profile image"
      {...rest}
    />
  );
};
