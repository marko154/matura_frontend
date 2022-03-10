import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createResource, For } from "solid-js";
import { getSessions } from "../../http/caregivers";
import { formatDate } from "../../utils/strings.utils";
import { Avatar } from "../common/Avatar";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Table } from "../common/Table/Table";

export const CaregiverSessions: Component = () => {
  const params = useParams();
  const [sessions, { refetch }] = createResource(() => params.id, getSessions);
  const [t] = useI18n();
  const navigate = useNavigate();

  return (
    <>
      {sessions.error ? (
        <Message>Error</Message>
      ) : sessions.loading || !sessions() ? (
        <Loader />
      ) : sessions()!.length === 0 ? (
        <Message className="mt-4">This caregiver doesn't have any sessions yet</Message>
      ) : (
        <Table class="my-8">
          <Table.Header>
            <Table.Row>
              <Table.Th></Table.Th>
              <Table.Th>Start Time</Table.Th>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <For each={sessions()!}>
              {(session) => (
                <Table.Row onClick={() => navigate(`/patient/${session.patient_id}`)}>
                  <Table.Td>
                    <Avatar imageURL={undefined} />
                  </Table.Td>
                  <Table.Td>{formatDate(session.start_time)}</Table.Td>
                  <Table.Td>{session.patient.first_name}</Table.Td>
                  <Table.Td>{session.patient.last_name}</Table.Td>
                  <Table.Td>{session.notes}</Table.Td>
                </Table.Row>
              )}
            </For>
            <Table.Row></Table.Row>
          </Table.Body>
        </Table>
      )}
    </>
  );
};
