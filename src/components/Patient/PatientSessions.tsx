import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, createResource, For } from "solid-js";
import { getSessions } from "../../http/patients";
import { formatDate } from "../../utils/strings.utils";
import { Avatar } from "../common/Avatar";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Table } from "../common/Table/Table";

export const PatientSessions: Component = () => {
  const params = useParams();
  const [sessions, {}] = createResource(params.id, getSessions);
  const navigate = useNavigate();

  createEffect(() => {
    console.log(sessions());
  });

  return (
    <>
      {sessions.loading || !sessions() ? (
        <Loader />
      ) : sessions.error ? (
        <Message className="mt-4">There was an error</Message>
      ) : sessions()!.length === 0 ? (
        <Message className="mt-4">This patient doesn't have any sessions yet</Message>
      ) : (
        <Table class="my-8">
          <Table.Header>
            <Table.Row>
              <Table.Th></Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={sessions()}>
              {(session) => (
                <Table.Row onClick={() => navigate(`/caregiver/${session.caregiver_id}`)}>
                  <Table.Td>
                    <Avatar imageURL={session.caregiver.user.avatar_url} />
                  </Table.Td>
                  <Table.Td>{formatDate(session.start_time)}</Table.Td>
                  <Table.Td>{session.caregiver.first_name}</Table.Td>
                  <Table.Td>{session.caregiver.last_name}</Table.Td>
                  <Table.Td>{session.notes}</Table.Td>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table>
      )}
    </>
  );
};
