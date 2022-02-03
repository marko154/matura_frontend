import { useParams } from "solid-app-router";
import { Component, createResource, Show } from "solid-js";
import { getPatient } from "../../http/patient";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";

const Patient: Component = () => {
	const params = useParams();
	// fetch mentor based on the id path parameter
	const [patient] = createResource(() => params.id, getPatient);

	return (
		<MainWrapper title="Patient">
			<Show when={!patient.loading} fallback={<Loader />}>
				<h1>{patient().email}</h1>
			</Show>
		</MainWrapper>
	);
};

export default Patient;
