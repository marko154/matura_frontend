import { createSignal, onMount, onCleanup } from "solid-js";

const createMediaQuery = (
  query: string,
  initialState: boolean = false,
  watchChange: boolean = true
): (() => boolean) => {
  let mql: MediaQueryList;
  const [state, setState] = createSignal(initialState);
  const onChange = () => setState(mql.matches);
  onMount(() => {
    mql = window.matchMedia(query);
    if (watchChange) {
      mql.addEventListener("change", onChange);
    }
    setState(mql.matches);
  });
  onCleanup(() => watchChange && mql.removeEventListener("change", onChange));
  return state;
};

export default createMediaQuery;
