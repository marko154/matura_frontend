import { useI18n } from "@amoutonbrady/solid-i18n";
import { NavLink } from "solid-app-router";
import { Component, createMemo, createSignal, For } from "solid-js";
import { ROLE_SIDEMENU } from "../../constants/sidemenu";
import { useAuth } from "../../context/AuthProvider";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";

export const Sidemenu: Component = () => {
	const [auth, { logout }] = useAuth();
	// const [width, setWidth] = createSignal(250); // TODO: make menu resizable
	const [t] = useI18n();

	const sidemenu = createMemo(() => {
		if (!auth.user?.user_type_id) return [];
		return ROLE_SIDEMENU[auth.user.user_type_id];
	});

	return (
		<menu className="bg-primary w-60 h-full text-white relative">
			<div className="mx-5 my-6 mt-4">
				<button class="ml-auto block" onClick={() => logout()}>
					<Icon name="logout" className="rotate-180" />
				</button>
				<div className="flex gap-x-1 truncate -mt-3">
					<Avatar imageURL={auth.user?.avatar_url} />
					<div className="flex flex-col justify-center">
						<div className="text-xl leading-none">
							{auth.user?.display_name}
						</div>
						<div className="truncate leading-tight text-sm">
							{auth.user?.email}
						</div>
					</div>
				</div>
			</div>

			<div className="grid">
				<For each={sidemenu()}>
					{(item) => (
						<NavLink
							href={item.path}
							activeClass="bg-blue-600"
							end={item.end}
							className="hover:bg-blue-600 text-xl pl-5 py-2"
						>
							{t(item.text)}
						</NavLink>
					)}
				</For>
			</div>

			{/* <div className="absolute top-0 bottom-0 -right-1 w-1 hover:bg-indigo-900 cursor-col-resize"></div> */}
		</menu>
	);
};
