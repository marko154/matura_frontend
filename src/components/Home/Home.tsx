import { useI18n } from "@amoutonbrady/solid-i18n";
import { Link } from "solid-app-router";
import { Component, createResource, For, onMount, Show } from "solid-js";
import { getRecentUsers } from "../../http/auth";
import { getAllSessions } from "../../http/sessions";
import { formatDate } from "../../utils/strings.utils";
import { Avatar } from "../common/Avatar";
import { MainWrapper } from "../common/MainWrapper";
import { Table } from "../common/Table/Table";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

const Map: Component = ({ ...rest }) => {
  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [16, 46], // starting position [lng, lat]
      zoom: 8, // starting zoom
    });
  });
  return (
    <div
      id="map"
      className="flex-1 rounded-md"
      style="height: 800px; flex: 3;"
      {...rest}
    ></div>
  );
};

const Home: Component = () => {
  const [t] = useI18n();
  const [recentUsers, {}] = createResource(getRecentUsers);
  const [sessionsData, { refetch }] = createResource<any, any>(
    () => ({ page: 1, search: "", limit: 5 }),
    getAllSessions
  );

  return (
    <MainWrapper title={t("sidebar.home")}>
      <div class="flex gap-7">
        <div class="flex-1">
          <Map />
        </div>
        <div class="flex-1">
          <h2 class="font-bold text-lg text-gray-700 pb-3">Recently Added Users</h2>
          <Show when={recentUsers()}>
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
          </Show>
          <h2 class="font-bold text-lg text-gray-700 py-3">Recent Sessions</h2>
          <Show when={sessionsData()}>
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
          </Show>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Home;
