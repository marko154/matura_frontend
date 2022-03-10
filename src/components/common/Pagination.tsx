import { Component, For, JSX, Show } from "solid-js";

type PaginationProps = JSX.IntrinsicElements["nav"] & {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: Component<PaginationProps> = ({
  totalPages,
  activePage,
  onPageChange,
  ...rest
}) => {
  const pages = [...Array(totalPages).keys()];

  const gotoPage = (page: number) => {
    if (page !== activePage) onPageChange(page);
  };

  return (
    <Show when={totalPages > 1}>
      <nav role="navigation" aria-label="Pagination Navigation" {...rest}>
        <ul className="flex gap-2">
          <For each={pages}>
            {(page) => (
              <li>
                <button
                  className="p-2 text-sm rounded-full w-10 h-10"
                  classList={{
                    "bg-primary": activePage === page + 1,
                    "bg-gray-200": activePage !== page + 1,
                    "text-white": activePage === page + 1,
                    "text-primary": activePage !== page + 1,
                  }}
                  onClick={() => gotoPage(page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </Show>
  );
};
