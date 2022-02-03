import {
	Component,
	createEffect,
	createResource,
	createSignal,
	For,
	Show,
} from "solid-js";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { MainWrapper } from "../common/MainWrapper";
import { CaregiversMap } from "./CaregiversMap";
import { deleteCaregiver, getCaregivers } from "../../http/caregivers";
import { Button } from "../common/Button/Button";
import { useNavigate } from "solid-app-router";
import { Loader } from "../common/Loader/Loader";
import { Table } from "../common/Table/Table";
import { formatDate } from "../../utils/strings.utils";
import { Modal } from "../common/Modal";
import { Pagination } from "../common/Pagination";

const CaregiversTable: Component = ({}) => {
	const navigate = useNavigate();
	const [t] = useI18n();
	const [page, setPage] = createSignal(1);
	const [data, { refetch }] = createResource(page, getCaregivers);
	const [userDeleteId, setUserDeleteId] = createSignal<number | null>(null);

	const redirectCreate = () => {
		navigate("/caregiver/create");
	};

	const redirect = (userId: number) => {
		navigate(`/caregiver/${userId}`);
	};

	const handleDeleteClick = (e: any, userId: number) => {
		e.stopPropagation();
		setUserDeleteId(userId);
	};

	const handleDeleteUser = async () => {
		try {
			await deleteCaregiver(userDeleteId()!.toString());
			refetch(); // change this to a mutation for performance
		} catch (err) {
			console.log(err);
		}
		setUserDeleteId(null);
	};
	createEffect(() => console.log(data()));
	return (
		<>
			<Button className="ml-auto block" onClick={redirectCreate}>
				Create a Caregiver
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
						<For each={data()!.caregivers}>
							{(mentor: any) => (
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
					className="mx-auto py-10"
					totalPages={Math.ceil(data()!.total / 10)}
					activePage={page()}
					onPageChange={setPage}
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
		</>
	);
};

const Caregivers: Component = () => {
	const [t] = useI18n();

	return (
		<MainWrapper title={t("sidebar.caregivers")}>
			{/* <CaregiversMap /> */}
			<CaregiversTable />
		</MainWrapper>
	);
};

export default Caregivers;
