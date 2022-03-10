import { Component, lazy } from "solid-js";
import { Public } from "../components/Public";
import { RequireAuth } from "../components/RequireAuth";

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
  {
    path: "/sessions",
    name: "Sessions",
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
  {
    path: "/reset-password/:token",
    name: "Reset Password",
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

const neutralRoutes: Route[] = [
  {
    path: "/*",
    name: "Page not found",
    component: PageNotFound,
  },
];

export { privateOnlyRoutes, publicOnlyRoutes, neutralRoutes };
