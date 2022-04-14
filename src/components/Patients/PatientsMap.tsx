import { Component, createEffect, createResource, onMount } from "solid-js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { getLocations, getPatient } from "../../http/patients";
import "../Patient/AssignCaregiver.css";
import { Loader } from "../common/Loader/Loader";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";
import { render } from "solid-js/web";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

const Popup: Component<{
  patient_id: number | undefined;
}> = ({ patient_id }) => {
  const [patient] = createResource(() => getPatient(String(patient_id)));
  createEffect(() => {
    console.log(patient(), patient_id);
  });

  return (
    <div class="px-2 pt-2 pb-0 flex flex-col gap-1 justify-center items-center">
      {patient.loading || !patient() ? (
        <Loader />
      ) : patient.error ? (
        <div>An error has occured</div>
      ) : (
        <>
          <h2>Patient</h2>
          <Avatar imageURL={undefined} size="w-14 h-14" />
          <a href={`/patient/${patient_id}`} class="flex">
            <div class="font-bold">{`${patient()!.first_name} ${
              patient()!.last_name
            }`}</div>
            {/* <div>{patient()?.location.place_name}</div> */}
            <span class="ml-1">
              <Icon name="arrow_forward" />
            </span>
          </a>
        </>
      )}
    </div>
  );
};

export const PatientsMap: Component<{ search: string }> = ({ search, ...rest }) => {
  const [locations] = createResource(getLocations);
  let map: mapboxgl.Map;

  onMount(() => {
    map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [14.9, 46.04869247806667], // starting position [lng, lat]
      zoom: 8, // starting zoom
    });
  });

  createEffect(() => {
    if (!locations()) return;
    for (const { lat, long, patient_id } of locations()!) {
      const el = document.createElement("div");
      el.className = "marker";
      const popupNode = document.createElement("div");
      render(() => <Popup patient_id={patient_id} />, popupNode);
      new mapboxgl.Marker(el)
        .setLngLat([long, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setDOMContent(popupNode)
        )
        .addTo(map);
    }
  });

  return <div id="map" className="mt-6 mb-8 flex-1 rounded-md" {...rest}></div>;
};
