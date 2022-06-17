import { useI18n } from "@amoutonbrady/solid-i18n";
import { NavLink } from "solid-app-router";
import { Component, createMemo, createSignal, For, onMount } from "solid-js";
import { ROLE_SIDEMENU } from "../../constants/sidemenu";
import { useAuth } from "../../context/AuthProvider";
import { useClickOutside } from "../../hooks/clickOutside";
import createMediaQuery from "../../hooks/createMediaQuery";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";
import "./Sidemenu.css";

export const Sidemenu: Component = () => {
  const [auth] = useAuth();
  // const [width, setWidth] = createSignal(250); // TODO: make menu resizable
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const isSmall = createMediaQuery("(max-width: 1200px)");
  const isMobile = createMediaQuery("(max-width: 700px)");
  const [t] = useI18n();

  const sidemenu = createMemo(() => {
    if (!auth.user?.user_type_id) return [];
    return ROLE_SIDEMENU[auth.user.user_type_id];
  });

  return (
    <menu
      className="sidemenu"
      classList={{
        "sidemenu-collapsed": isSmall() || isCollapsed(),
        "sidemenu-mobile": isMobile(),
      }}
    >
      <div className="ml-5 mr-4 mb-7 mt-3">
        <div className="flex justify-end">
          <SettingsMenu />
        </div>
        <div className="flex gap-x-1 truncate -mt-2">
          <Avatar imageURL={auth.user?.avatar_url} className="mr-3" />
          <div className="flex flex-col justify-center">
            <div className="text-xl leading-none">{auth.user?.display_name}</div>
            <div className="truncate leading-tight text-sm capitalize">
              {auth.user?.user_type.user_type}
              {/* {auth.user?.email} */}
            </div>
            <Icon name="more_horiz" />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <For each={sidemenu()}>
          {(item) => (
            <NavLink
              href={item.path}
              activeClass="bg-blue-600"
              end={item.end}
              className="hover:bg-blue-600 text-lg pl-6 py-2"
            >
              {t(item.text)}
            </NavLink>
          )}
        </For>
      </div>

      {/* <div className="absolute top-0 bottom-0 -right-1 w-1 hover:bg-indigo-900 cursor-col-resize"></div> */}

      <div className="mt-auto flex">
        <Icon
          name="arrow_back_ios"
          className="ml-auto p-3 mr-2 text-sm cursor-pointer hover:bg-blue-700 rounded-full transition-transform"
          classList={{ "rotate-180": isCollapsed() }}
          onClick={() => setIsCollapsed((p) => !p)}
        />
      </div>
    </menu>
  );
};

function SettingsMenu({}) {
  const [actionsMenuOpen, setActionsMenuOpen] = createSignal(false);
  const [languageOpen, setLanguageOpen] = createSignal(false);
  const [t, { locale }] = useI18n();
  const [, { logout }] = useAuth();
  let menuRef!: HTMLDivElement;

  onMount(() => {
    useClickOutside(menuRef, () => {
      if (actionsMenuOpen()) {
        setActionsMenuOpen(false);
      }
    });
  });

  return (
    <>
      <div
        class="hover:bg-white/10 px-1 rounded flex items-center cursor-pointer"
        onClick={() => setActionsMenuOpen(true)}
      >
        <Icon name="settings" />
      </div>
      <div
        class="absolute bg-gray-200 w-40 rounded text-gray-900 shadow-sm z-10 transition-all"
        style={{
          left: "calc(100% - 0.5rem)",
          "pointer-events": actionsMenuOpen() ? "all" : "none",
          opacity: actionsMenuOpen() ? 1 : 0,
          transform: actionsMenuOpen() ? "scale(1)" : "scale(0.9)",
          "transform-origin": "top left",
        }}
        ref={menuRef}
      >
        <div
          class="flex justify-between cursor-pointer py-2 px-2 hover:bg-gray-300 rounded"
          onClick={() => locale(locale() === "en" ? "sl" : "en")}
        >
          Language
          <Icon name="translate" />
        </div>
        <div
          onClick={() => logout()}
          class="flex justify-between cursor-pointer py-2 px-2 hover:bg-gray-300 rounded"
        >
          Log out
          <Icon className="rotate-180" name="logout" />
        </div>
      </div>
    </>
  );
}
