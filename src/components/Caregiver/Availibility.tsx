import { useParams } from "solid-app-router";
import { Component, createEffect, createResource } from "solid-js";
import { getAvailibility } from "../../http/caregivers";

export const Availibility: Component = () => {
  const params = useParams();
  const [availibilities, { refetch }] = createResource(() => params.id, getAvailibility);

  createEffect(() => {
    console.log(availibilities());
  });

  return <div>Availibility</div>;
};
