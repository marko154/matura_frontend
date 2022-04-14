import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { formatDate } from "../../utils/strings.utils";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";

export const PatientsTable: Component<{
  data: any;
  params: any;
  setParams: (key: string, val: any) => void;
}> = ({ data, params, setParams }) => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const redirect = (patientId: number) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <Show when={!data.loading} fallback={<Loader />}>
      {data()!.patients.length === 0 ? (
        <Message className="mt-4">No results found. Try a different query.</Message>
      ) : (
        <Table className="mt-3">
          <Table.Header>
            <Table.Row>
              <Table.Th>ID</Table.Th>
              <Table.Th>{t("email")}</Table.Th>
              <Table.Th>{t("firstName")}</Table.Th>
              <Table.Th>{t("lastName")}</Table.Th>
              {/* <Table.Th>{t("gender")}</Table.Th> */}
              <Table.Th>{t("phoneNumber")}</Table.Th>
              <Table.Th>{t("dateOfBirth")}</Table.Th>
              <Table.Th>Created at</Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={data()!.patients}>
              {(patient: any) => (
                <Table.Row
                  class="cursor-pointer"
                  onClick={() => redirect(patient.patient_id!)}
                >
                  <Table.Td>{patient.patient_id}</Table.Td>
                  <Table.Td>{patient.email}</Table.Td>
                  <Table.Td>{patient.first_name}</Table.Td>
                  <Table.Td>{patient.last_name}</Table.Td>
                  {/* <Table.Td>{patient.gender}</Table.Td> */}
                  <Table.Td>
                    <a href={`tel:${patient.phone_number}`}>{patient.phone_number}</a>
                  </Table.Td>
                  <Table.Td>{formatDate(patient.date_of_birth)}</Table.Td>
                  <Table.Td>{formatDate(patient.date_created!)}</Table.Td>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table>
      )}

      <Pagination
        totalPages={Math.ceil(data()!.total / 10)}
        activePage={params.page}
        onPageChange={(page) => setParams("page", page)}
        className="mx-auto py-10"
      />
    </Show>
  );
};
