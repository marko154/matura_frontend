import { Component, createResource, For, JSX, Show } from "solid-js";
import createDebounce from "@solid-primitives/debounce";
import { getMentors } from "../http/mentors";
import { Loader } from "./common/Loader/Loader";

type SelectProps = JSX.IntrinsicElements["div"] & {
	setMentor: (mentor: Mentor) => void;
};

export const SelectMentor: Component<SelectProps> = ({
	setMentor,
	...rest
}) => {
	// const [debounced, cancel] = createDebounce();
	const [data, { refetch }] = createResource(getMentors);

	const handleSearch = (e: any) => {
		console.log(e.target.value);
	};

	return (
		<div {...rest}>
			<input
				onInput={handleSearch}
				placeholder="Search for a mentor"
				className="py-3 px-4 border border-primary rounded-md w-full shadow-md outline-none focus:bg-slate-50"
			/>
			<Show when={data()} fallback={<Loader />}>
				<For each={data()!.mentors}>
					{(mentor) => (
						<tr
							className="flex justify-between cursor-pointer px-4 py-2 hover:bg-gray-200"
							onClick={() => setMentor(mentor)}
						>
							<td>{mentor.first_name}</td>
							<td>{mentor.last_name}</td>
							<td>{mentor.user.email}</td>
						</tr>
					)}
				</For>
			</Show>
		</div>
	);
};
