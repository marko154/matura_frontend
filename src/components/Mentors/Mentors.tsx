import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createResource, For, Show } from "solid-js";
import { getMentors } from "../../http/mentors";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Table } from "../common/Table/Table";

const Mentors: Component = () => {
	const [t] = useI18n();
	const [data] =
		createResource<{ data: (Mentor & { user: User })[] }>(getMentors);
	const navigate = useNavigate();

	const redirect = () => {
		navigate("/mentor/create");
	};

	return (
		<MainWrapper title={t("sidebar.mentors")}>
			<Button className="ml-auto block" onClick={redirect}>
				{t("mentor.createMentor")}
			</Button>

			<Show when={data()} fallback={<Loader />}>
				<Table className="mt-3">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>Email</Table.HeaderCell>
							<Table.HeaderCell>First Name</Table.HeaderCell>
							<Table.HeaderCell>Last Name</Table.HeaderCell>
							<Table.HeaderCell>Gender</Table.HeaderCell>
							<Table.HeaderCell>
								{t("phoneNumber")}
							</Table.HeaderCell>
							<Table.HeaderCell>
								{t("dateOfBirth")}
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<For each={data()!.data}>
							{(mentor) => (
								<Table.Row>
									<Table.Cell>
										{mentor.user.user_id}
									</Table.Cell>
									<Table.Cell>{mentor.user.email}</Table.Cell>
									<Table.Cell>{mentor.first_name}</Table.Cell>
									<Table.Cell>{mentor.last_name}</Table.Cell>
									<Table.Cell>{mentor.gender}</Table.Cell>
									<Table.Cell>
										{mentor.phone_number}
									</Table.Cell>
									<Table.Cell>
										{formatDate(mentor.date_of_birth)}
									</Table.Cell>
								</Table.Row>
							)}
						</For>
					</Table.Body>
				</Table>
			</Show>
		</MainWrapper>
	);
};

export default Mentors;
