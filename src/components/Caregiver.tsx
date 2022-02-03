import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, Show } from "solid-js";
import { getCaregiver } from "../http/caregivers";
import { Loader } from "./common/Loader/Loader";
import { MainWrapper } from "./common/MainWrapper";

const Caregiver: Component = () => {
	const params = useParams();
	// fetch caregiver based on the id path parameter
	const [caregiver] = createResource(() => params.id, getCaregiver);
	createEffect(() => {
		console.log(caregiver());
	});
	return (
		<MainWrapper title="Caregiver">
			<Show when={!caregiver.loading} fallback={<Loader />}>
				<h1>{caregiver().email}</h1>
			</Show>
		</MainWrapper>
	);
};

export default Caregiver;
