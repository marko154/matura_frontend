import { Navigate, useLocation } from "solid-app-router";
import { Component, Show } from "solid-js";
import { useAuth } from "../context/AuthProvider";
import { Sidemenu } from "./Sidemenu/Sidemenu";

export const RequireAuth: Component = (props) => {
  const [auth] = useAuth();
  const location = useLocation();
  // save current path to location state, so that when user
  // logs in he gets redirected back to where he wanted to go
  // instead of /
  return (
    <Show
      when={auth.user}
      fallback={<Navigate href="/signin" state={location.pathname} />}
    >
      {/* <Sidemenu /> */}
      {props.children}
    </Show>
  );
};
