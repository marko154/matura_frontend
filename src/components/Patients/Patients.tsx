import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createResource, createSignal, For, Show } from "solid-js";
import { getPatients, Response } from "../../http/patient";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Modal } from "../common/Modal";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";

const Patients: Component = () => {
	const [t] = useI18n();
	const [page, setPage] = createSignal(1);
	const [data, { refetch }] = createResource<Response, number>(
		page,
		getPatients
	);
	const navigate = useNavigate();

	const redirectCreate = () => {
		navigate("/patient/create");
	};

	const redirect = (patientId: number) => {
		navigate(`/patient/${patientId}`);
	};

	return (
		<MainWrapper title={t("sidebar.patients")}>
			<Button className="ml-auto block" onClick={redirectCreate}>
				{t("patient.createPatient")}
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
							<Table.Th>Created at</Table.Th>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<For each={data()!.patients}>
							{(patient) => (
								<Table.Row
									class="cursor-pointer"
									onClick={() =>
										redirect(patient.patient_id!)
									}
								>
									<Table.Td>{patient.patient_id}</Table.Td>
									<Table.Td>{patient.email}</Table.Td>
									<Table.Td>{patient.first_name}</Table.Td>
									<Table.Td>{patient.last_name}</Table.Td>
									<Table.Td>{patient.gender}</Table.Td>
									<Table.Td>
										<a href={`tel:${patient.phone_number}`}>
											{patient.phone_number}
										</a>
									</Table.Td>
									<Table.Td>
										{formatDate(patient.date_of_birth)}
									</Table.Td>
									<Table.Td>
										{formatDate(patient.date_created!)}
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
			</Show>
		</MainWrapper>
	);
};

export default Patients;
