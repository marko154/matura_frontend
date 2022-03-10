import { Component, For, JSX } from "solid-js";
import { getHighlightedSegments } from "../../utils/strings.utils";

type SearchedTextProps = JSX.IntrinsicElements["input"] & {
  text: string;
  search: string;
};

export const SearchedText: Component<SearchedTextProps> = ({ text, search, ...rest }) => {
  return (
    <For each={getHighlightedSegments(text, search)}>
      {({ highlighted, text }) => (highlighted ? <strong>{text}</strong> : text)}
    </For>
  );
};
