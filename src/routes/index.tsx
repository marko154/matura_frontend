import { Component, lazy } from "solid-js";
import { Public } from "../components/Public";
import { RequireAuth } from "../components/RequireAuth";
import { RouteDefinition } from "solid-app-router";

const SignUp = lazy(() => import("../components/SignUp"));
const SignIn = lazy(() => import("../components/SignIn"));
const Home = lazy(() => import("../components/Home/Home"));
const Caregivers = lazy(() => import("../components/Caregivers/Caregivers"));
const Caregiver = lazy(() => import("../components/Caregiver/Caregiver"));
const Patients = lazy(() => import("../components/Patients/Patients"));
const Mentors = lazy(() => import("../components/Mentors/Mentors"));
const Mentor = lazy(() => import("../components/Mentors/Mentor"));
const Patient = lazy(() => import("../components/Patient/Patient"));
const CreateMentor = lazy(() => import("../components/Mentors/CreateMentor"));
const CreateCaregiver = lazy(
  () => import("../components/CreateCaregiver/CreateCaregiver")
);
const CreatePatient = lazy(() => import("../components/Patients/CreatePatient"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));
const ResetPassword = lazy(() => import("../components/ResetPassword"));
const Sessions = lazy(() => import("../components/Sessions/Sessions"));
const Support = lazy(() => import("../components/Support"));

const privateOnlyRoutes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/caregivers",
    component: Caregivers,
  },
  {
    path: "/patients",
    component: Patients,
  },
  {
    path: "/mentors",
    component: Mentors,
  },
  {
    path: "/mentor/:id",
    component: Mentor,
  },
  {
    path: "/patient/:id",
    component: Patient,
  },
  {
    path: "/mentor/create",
    component: CreateMentor,
  },
  {
    path: "/caregiver/:id",
    component: Caregiver,
  },
  {
    path: "/caregiver/create",
    component: CreateCaregiver,
  },
  {
    path: "/patient/create",
    component: CreatePatient,
  },
  {
    path: "/sessions",
    component: Sessions,
  },
].map((route) => ({
  ...route,
  component: () => (
    <RequireAuth>
      <route.component />
    </RequireAuth>
  ),
}));

const publicOnlyRoutes: RouteDefinition[] = [
  {
    path: "/signup",
    component: SignUp,
  },
  {
    path: "/signin",
    component: SignIn,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
  },
].map((route) => ({
  ...route,
  component: () => (
    <Public>
      <route.component />
    </Public>
  ),
}));

const neutralRoutes: RouteDefinition[] = [
  { path: "/support", component: Support },
  {
    path: "/*",
    component: PageNotFound,
  },
];

export { privateOnlyRoutes, publicOnlyRoutes, neutralRoutes };
