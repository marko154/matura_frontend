import { createEffect, onCleanup, onMount } from "solid-js";

// declare module "solid-js" {
//   namespace JSX {
//     interface Directives {
//       clickOutside?: () => void;
//     }
//   }
// }

export function clickOutside(el: any, accessor: any) {
  const onClick = (e: any) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

export function useClickOutside(el: any, callback: any) {
  const onClick = (e: any) => {
    !el.contains(e.target) && callback?.();
  };
  document.body.addEventListener("click", onClick);
  onCleanup(() => document.body.removeEventListener("click", onClick));
}
