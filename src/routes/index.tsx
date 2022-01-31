import { Component, lazy } from "solid-js";
import { Public } from "../components/Public";

const SignUp = lazy(() => import("../components/SignUp/SignUp"));
const SignIn = lazy(() => import("../components/SignIn/SignIn"));
const Home = lazy(() => import("../components/Home/Home"));
const Caregivers = lazy(() => import("../components/Caregivers/Caregivers"));
const Patients = lazy(() => import("../components/Patients/Patients"));
const Mentors = lazy(() => import("../components/Mentors/Mentors"));
const PageNotFound = lazy(
	() => import("../components/PageNotFound/PageNotFound")
);

import { RequireAuth } from "../components/RequireAuth";

interface Route {
	path: string;
	name: string;
	component: Component;
}

const privateOnlyRoutes: Route[] = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/caregivers",
		name: "Caregivers",
		component: Caregivers,
	},
	{
		path: "/patients",
		name: "Patients",
		component: Patients,
	},
	{
		path: "/mentors",
		name: "Mentors",
		component: Mentors,
	},
].map((route) => ({
	...route,
	component: () => (
		<RequireAuth>
			<route.component />
		</RequireAuth>
	),
}));

const publicOnlyRoutes: Route[] = [
	{
		path: "/signup",
		name: "Sign up",
		component: SignUp,
	},
	{
		path: "/signin",
		name: "Sign in",
		component: SignIn,
	},
].map((route) => ({
	...route,
	component: () => (
		<Public>
			<route.component />
		</Public>
	),
}));

const neutralRoutes: Route[] = [
	{
		path: "/*",
		name: "Page not found",
		component: PageNotFound,
	},
];

export { privateOnlyRoutes, publicOnlyRoutes, neutralRoutes };
