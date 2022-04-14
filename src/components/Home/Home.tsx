import { useI18n } from "@amoutonbrady/solid-i18n";
import { Link } from "solid-app-router";
import { Component, createResource, For, Show } from "solid-js";
import { adminCreateUser, getRecentUsers } from "../../http/auth";
import { getAllSessions } from "../../http/sessions";
import { formatDate } from "../../utils/strings.utils";
import { Avatar } from "../common/Avatar";
import { MainWrapper } from "../common/MainWrapper";
import { Table } from "../common/Table/Table";

import { useAuth } from "../../context/AuthProvider";
import { Loader } from "../common/Loader/Loader";
import { Button } from "../common/Button/Button";
import { Modal } from "../common/Modal/Modal";
import { createDisclosure } from "@hope-ui/solid";
import { Input } from "../common/Input/Input";
import { Select } from "../common/Select/Select";
import { createStore } from "solid-js/store";
import { getErrorMessage } from "../../utils/errors";
import { toast } from "../common/Toast/Toast";
import { HomeMap } from "./HomeMap";

const CreateUser: Component = () => {
  const [t] = useI18n();
  const { isOpen, onClose, onOpen } = createDisclosure();
  const [state, setState] = createStore({
    email: "",
    display_name: "",
    user_type_id: 4,
    loading: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setState("loading", true);
    try {
      await adminCreateUser({
        email: state.email,
        user_type_id: state.user_type_id,
        display_name: state.display_name || null,
      });
      toast({ text: "User successfully added." });
    } catch (err) {
      console.log(err);
      toast({ text: "An error occured while adding the user" });
    }
    setState("loading", false);
  };

  return (
    <>
      <Button onClick={onOpen}>Add User</Button>
      <Modal open={isOpen()} onClose={onClose}>
        <h2 class="text-2xl text-gray-700">Add a new user</h2>
        <div class="text-gray-600 text-sm">
          The user will receive an invitation to his/her email address.
        </div>
        <form class="flex flex-col gap-5 my-8" style="min-width: 420px">
          <Input
            type="email"
            label="Email"
            version="secondary"
            onInput={(e) => setState("email", e.currentTarget.value)}
          />
          <Input
            type="text"
            label="Display name (optional)"
            version="secondary"
            onInput={(e) => setState("display_name", e.currentTarget.value)}
          />
          <Select
            options={[
              { text: "Limited User", val: 4 },
              { text: "Admin", val: 1 },
            ]}
            defaultValue={"Admin"}
            placeholder="User type"
            onChange={(v) => setState("user_type_id", v)}
          />
        </form>
        <Button
          className="ml-auto"
          onClick={handleSubmit}
          disabled={state.loading || !state.email}
          loading={state.loading}
        >
          Add User
        </Button>
      </Modal>
    </>
  );
};

const Home: Component = () => {
  const [t] = useI18n();
  const [recentUsers, {}] = createResource(getRecentUsers);
  const [{ user }] = useAuth();
  const [sessionsData, { refetch }] = createResource<any, any>(
    () => ({ page: 1, search: "", limit: 5 }),
    getAllSessions
  );

  return (
    <MainWrapper title={t("welcome", { user: user!.display_name || "" })}>
      <div class="flex flex-col gap-7">
        <div class="flex-1">
          <HomeMap />
        </div>
        <div class="flex-1 flex gap-16">
          <Show when={recentUsers()}>
            <div>
              <div class="flex justify-between mb-3">
                <h2 class="font-bold text-lg text-gray-700 pb-3">Recently Added Users</h2>
                <CreateUser />
              </div>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Th></Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Time</Table.Th>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <For each={recentUsers()}>
                    {(user: any) => (
                      <Table.Row>
                        <Table.Td class="p-2" style="font-size: 15px;">
                          <Avatar imageURL={user.avatar_url} />
                        </Table.Td>
                        <Table.Td class="p-2" style="font-size: 15px;">
                          {user.email}
                        </Table.Td>
                        <Table.Td class="p-2" style="font-size: 15px;">
                          {user.user_type.user_type}
                        </Table.Td>
                        <Table.Td class="p-2" style="font-size: 15px;">
                          {formatDate(user.registration_date)}
                        </Table.Td>
                      </Table.Row>
                    )}
                  </For>
                </Table.Body>
              </Table>
            </div>
          </Show>
          <Show when={sessionsData()}>
            <div>
              <h2 class="font-bold text-lg text-gray-700 py-3">Recent Sessions</h2>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Caregiver</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Notes</Table.Th>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <For each={sessionsData().sessions}>
                    {(session: any) => (
                      <Table.Row>
                        <Table.Td style="font-size: 15px;">
                          <Link
                            href={`/patient/${session.patient_id}`}
                            class="hover:underline text-gray-700 font-bold"
                          >
                            {`${session.patient.first_name} ${session.patient.last_name}`}
                          </Link>
                        </Table.Td>
                        <Table.Td style="font-size: 15px;">
                          <Link
                            href={`/caregiver/${session.caregiver_id}`}
                            class="hover:underline text-gray-700 font-bold"
                          >
                            {`${session.caregiver.first_name} ${session.caregiver.last_name}`}
                          </Link>
                        </Table.Td>
                        <Table.Td style="font-size: 15px;">
                          {formatDate(session.start_time)}
                        </Table.Td>
                        <Table.Td style="font-size: 15px;">{session.notes}</Table.Td>
                      </Table.Row>
                    )}
                  </For>
                </Table.Body>
              </Table>
            </div>
          </Show>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Home;
