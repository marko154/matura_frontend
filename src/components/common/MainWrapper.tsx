import { Component, JSX } from "solid-js";

type MainWrapperProps = JSX.IntrinsicElements["main"] & {
  title?: string;
};

export const MainWrapper: Component<MainWrapperProps> = ({
  title,
  children,
  // className="",
  ...rest
}) => {
  return (
    <div className="overflow-auto flex flex-1">
      <main className="flex flex-col flex-1 relative mx-12" {...rest}>
        {title && <h1 className="text-3xl mb-6 mt-8 text-gray-700">{title}</h1>}
        {children}
      </main>
    </div>
  );
};
