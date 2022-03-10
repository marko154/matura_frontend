import { Component, createEffect, createMemo, createSignal, For, JSX } from "solid-js";

type TabsProps = JSX.IntrinsicElements["div"] & {
  panes: { title: string | JSX.Element; element: Component }[];
  activePane?: number;
  defaultIndex?: number;
};

export const Tabs: Component<TabsProps> = ({ panes, defaultIndex }) => {
  const [activeTab, setActiveTab] = createSignal(defaultIndex || 0);

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  const activeTabClasses = "bg-gray-100 text-primary border-b-2";
  const normalClasses = "text-gray-600";

  return (
    <div>
      <nav className="flex border-b-2">
        <For each={panes}>
          {(pane, idx) => (
            <div
              onClick={() => handleTabChange(idx())}
              style="margin-bottom: -2px"
              className={`px-5 py-3 cursor-pointer 
							hover:bg-gray-100 hover:text-black 
							transition-colors border-primary font-bold rounded-t-md`}
              classList={{
                [activeTabClasses]: idx() === activeTab(),
                [normalClasses]: idx() !== activeTab(),
              }}
            >
              {pane.title}
            </div>
          )}
        </For>
      </nav>
      <section>{panes[activeTab()].element({})}</section>
    </div>
  );
};
