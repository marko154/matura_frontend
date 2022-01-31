import { Navigate, useLocation } from "solid-app-router";
import { Component, Show } from "solid-js";
import { useAuth } from "../context/AuthProvider";

export const Public: Component = (props) => {
	const [auth] = useAuth();
	const location = useLocation();

	return (
		<Show
			when={!auth.user}
			fallback={<Navigate href="/" state={location.pathname} />}
		>
			{props.children}
		</Show>
	);
};
