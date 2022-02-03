import { Component, lazy } from "solid-js";
import { Public } from "../components/Public";

const SignUp = lazy(() => import("../components/SignUp"));
const SignIn = lazy(() => import("../components/SignIn"));
const Home = lazy(() => import("../components/Home/Home"));
const Caregivers = lazy(() => import("../components/Caregivers/Caregivers"));
const Caregiver = lazy(() => import("../components/Caregiver"));
const Patients = lazy(() => import("../components/Patients/Patients"));
const Mentors = lazy(() => import("../components/Mentors/Mentors"));
const Mentor = lazy(() => import("../components/Mentor/Mentor"));
const Patient = lazy(() => import("../components/Patients/Patient"));
const CreateMentor = lazy(
	() => import("../components/CreateMentor/CreateMentor")
);
const CreateCaregiver = lazy(() => import("../components/CreateCaregiver"));
const CreatePatient = lazy(
	() => import("../components/Patients/CreatePatient")
);
const PageNotFound = lazy(() => import("../components/PageNotFound"));

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
	{
		path: "/mentor/:id",
		name: "Mentor",
		component: Mentor,
	},
	{
		path: "/patient/:id",
		name: "Patient",
		component: Patient,
	},
	{
		path: "/mentor/create",
		name: "Create Mentor",
		component: CreateMentor,
	},
	{
		path: "/caregiver/:id",
		name: "Caregiver",
		component: Caregiver,
	},
	{
		path: "/caregiver/create",
		name: "Create Caregiver",
		component: CreateCaregiver,
	},
	{
		path: "/patient/create",
		name: "Create Patient",
		component: CreatePatient,
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
