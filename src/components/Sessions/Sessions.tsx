import { Link, useNavigate } from "solid-app-router";
import { Component, createResource, For } from "solid-js";
import { createStore } from "solid-js/store";
import { getAllSessions } from "../../http/sessions";
import { Input } from "../common/Input/Input";
import { MainWrapper } from "../common/MainWrapper";
import createDebounce from "@solid-primitives/debounce";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";
import { formatDate } from "../../utils/strings.utils";
import { toTimeInputValue } from "../../utils/date.utils";

const Sessions: Component = () => {
  const [t] = useI18n();
  const [params, setParams] = createStore({ page: 1, search: "", from: "", to: "" });
  const [data, { refetch }] = createResource<any, any>(
    () => ({ ...params }),
    getAllSessions
  );
  const navigate = useNavigate();

  const [setSearch, clear] = createDebounce(
    (search) => setParams("search", search as string),
    500
  );

  return (
    <MainWrapper title="Sessions">
      <div className="flex gap-3">
        <Input
          className="w-80"
          version="secondary"
          placeholder={t("searchBy")}
          onInput={(e) => setSearch(e.currentTarget.value)}
          icon="search"
          autofocus
        />
        <Input
          type="date"
          version="secondary"
          className="w-60"
          onInput={(e) => setParams("from", e.currentTarget.value)}
        />
        <Input
          type="date"
          version="secondary"
          className="w-60"
          onInput={(e) => setParams("to", e.currentTarget.value)}
        />
      </div>

      {data.loading || !data() ? (
        <Loader />
      ) : data.error ? (
        <Message>There was an error</Message>
      ) : (
        <>
          {data().sessions.length === 0 ? (
            <Message className="mt-6">No results</Message>
          ) : (
            <>
              <Table className="mt-6">
                <Table.Header>
                  <Table.Row>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Caregiver</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Notes</Table.Th>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <For each={data().sessions}>
                    {(session: any) => (
                      <Table.Row>
                        <Table.Td>
                          <Link
                            href={`/patient/${session.patient_id}`}
                            class="hover:underline text-gray-700 font-bold"
                          >
                            {`${session.patient.first_name} ${session.patient.last_name}`}
                          </Link>
                        </Table.Td>
                        <Table.Td>
                          <Link
                            href={`/caregiver/${session.caregiver_id}`}
                            class="hover:underline text-gray-700 font-bold"
                          >
                            {`${session.caregiver.first_name} ${session.caregiver.last_name}`}
                          </Link>
                        </Table.Td>
                        <Table.Td>{formatDate(session.start_time)}</Table.Td>
                        <Table.Td>
                          {session.duration &&
                            toTimeInputValue(session.duration).substring(0, 5)}
                        </Table.Td>
                        <Table.Td>{session.notes}</Table.Td>
                      </Table.Row>
                    )}
                  </For>
                </Table.Body>
              </Table>
              <Pagination
                totalPages={Math.ceil(data()!.total / 10)}
                activePage={params.page}
                onPageChange={(page) => setParams("page", page)}
                className="mx-auto py-10"
              />
            </>
          )}
        </>
      )}
    </MainWrapper>
  );
};

export default Sessions;
