import { Component, createEffect, createSignal } from "solid-js";
import { I18nProvider } from "@amoutonbrady/solid-i18n";
import { Router, useRoutes } from "solid-app-router";
import { privateOnlyRoutes, publicOnlyRoutes, neutralRoutes } from "./routes";
import { dict } from "./translations";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import { Sidemenu } from "./components/Sidemen/Sidemenu";

const App: Component = () => {
	const Routes = useRoutes([
		...privateOnlyRoutes,
		...publicOnlyRoutes,
		...neutralRoutes,
	]);

	return (
		<I18nProvider dict={dict} locale={"en"}>
			<Router>
				<AuthProvider>
					{useAuth()[0].user && <Sidemenu />}
					<Routes />
				</AuthProvider>
			</Router>
		</I18nProvider>
	);
};

export default App;
