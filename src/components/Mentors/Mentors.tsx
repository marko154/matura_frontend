import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createResource, createSignal, For, Show } from "solid-js";
import { deleteMentor, getMentors, Response } from "../../http/mentors";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Modal } from "../common/Modal";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";

const Mentors: Component = () => {
	const [t] = useI18n();
	const [userDeleteId, setUserDeleteId] = createSignal<number | null>(null);
	const [page, setPage] = createSignal(1);
	const [data, { refetch }] = createResource<Response, number>(
		page,
		getMentors
	);
	const navigate = useNavigate();

	const redirectCreate = () => {
		navigate("/mentor/create");
	};

	const redirect = (userId: number) => {
		navigate(`/mentor/${userId}`);
	};

	const handleDeleteClick = (e: any, userId: number) => {
		e.stopPropagation();
		setUserDeleteId(userId);
	};

	const handleDeleteUser = async () => {
		try {
			await deleteMentor(userDeleteId()!.toString());
			refetch(); // change this to a mutation for performance
		} catch (err) {
			console.log(err);
		}
		setUserDeleteId(null);
	};

	return (
		<MainWrapper title={t("sidebar.mentors")}>
			<Button className="ml-auto block" onClick={redirectCreate}>
				{t("mentor.createMentor")}
			</Button>

			<Show when={data()} fallback={<Loader />}>
				<Table className="mt-3">
					<Table.Header>
						<Table.Row>
							<Table.Th>ID</Table.Th>
							<Table.Th>{t("email")}</Table.Th>
							<Table.Th>{t("firstName")}</Table.Th>
							<Table.Th>{t("lastName")}</Table.Th>
							<Table.Th>{t("gender")}</Table.Th>
							<Table.Th>{t("phoneNumber")}</Table.Th>
							<Table.Th>{t("dateOfBirth")}</Table.Th>
							<Table.Th></Table.Th>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<For each={data()!.mentors}>
							{(mentor) => (
								<Table.Row
									class="cursor-pointer"
									onClick={() =>
										redirect(mentor.user.user_id)
									}
								>
									<Table.Td>{mentor.user.user_id}</Table.Td>
									<Table.Td>{mentor.user.email}</Table.Td>
									<Table.Td>{mentor.first_name}</Table.Td>
									<Table.Td>{mentor.last_name}</Table.Td>
									<Table.Td>{mentor.gender}</Table.Td>
									<Table.Td>
										<a href={`tel:${mentor.phone_number}`}>
											{mentor.phone_number}
										</a>
									</Table.Td>
									<Table.Td>
										{formatDate(mentor.date_of_birth)}
									</Table.Td>
									<Table.Td>
										<Button
											onClick={(e) =>
												handleDeleteClick(
													e,
													mentor.user.user_id
												)
											}
										>
											Delete
										</Button>
									</Table.Td>
								</Table.Row>
							)}
						</For>
					</Table.Body>
				</Table>
				<Pagination
					totalPages={Math.ceil(data()!.total / 10)}
					activePage={page()}
					onPageChange={setPage}
					className="mx-auto py-10"
				/>
				<Modal open={userDeleteId() !== null}>
					<h2 className="mb-8 text-lg">{t("confirmationNote")}</h2>
					<div className="flex justify-end gap-2">
						<Button onClick={() => setUserDeleteId(null)}>
							{t("cancel")}
						</Button>
						<Button onClick={handleDeleteUser}>
							{t("confirm")}
						</Button>
					</div>
				</Modal>
			</Show>
		</MainWrapper>
	);
};

export default Mentors;
