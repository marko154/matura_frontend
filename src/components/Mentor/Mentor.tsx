import { useParams } from "solid-app-router";
import { Component, createResource, Show } from "solid-js";
import { getMentor } from "../../http/mentors";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";

const Mentor: Component = () => {
	const params = useParams();
	// fetch mentor based on the id path parameter
	const [mentor] = createResource(() => params.id, getMentor);

	return (
		<MainWrapper title="Mentor">
			<Show when={!mentor.loading} fallback={<Loader />}>
				<h1>{mentor().email}</h1>
			</Show>
		</MainWrapper>
	);
};

export default Mentor;
