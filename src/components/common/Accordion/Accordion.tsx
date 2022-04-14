import { Component, createSignal, JSX } from "solid-js";
// import "./Accordion.css";

export const createAccordion = ({
  initialState = [],
  ...rest
}: {
  initialState: number[];
}) => {
  const [openIndexes, setOpenIndexes] = createSignal<number[]>(initialState);
  const handleItemClick = (idx: number) => {
    setOpenIndexes([idx]);
  };
  return { openIndexes, handleItemClick };
};

export const AccordionItem: Component = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

export const AccordionButton: Component<any> = ({ children, ...rest }) => {
  return (
    <div
      class="flex justify-between cursor-pointer text-lg bg-gray-100 py-4 pl-9 pr-5 font-bold rounded-md"
      {...rest}
    >
      {children}
    </div>
  );
};

export const AccordionContent: Component<{ isOpen: boolean }> = ({
  isOpen,
  children,
  ...rest
}) => {
  return (
    <div class="py-6 px-10" classList={{ hidden: !isOpen }} {...rest}>
      {children}
    </div>
  );
};
