import { Component, JSX, onMount } from "solid-js";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Loader } from "../common/Loader/Loader";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

type MapProps = JSX.IntrinsicElements["div"] & {
  patients: any[];
  caregiver: Caregiver & { location: Location };
};

const Map: Component<MapProps> = ({ caregiver, patients, ...rest }) => {
  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: caregiver.location.coordinates, // starting position [lng, lat]
      zoom: 8, // starting zoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    // add markers to map
    for (const patient of patients) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";

      // make a marker for each feature and add it to the map
      new mapboxgl.Marker(el)
        .setLngLat([patient.long, patient.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<h3>${patient.first_name}</h3><p>${patient.last_name}</p>`)
        )
        .addTo(map);
    }
    const el = document.createElement("div");
    el.className = "marker caregiver-marker";
    new mapboxgl.Marker(el)
      .setLngLat(caregiver.location.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`<h3>${caregiver.first_name}</h3><p>${caregiver.last_name}</p>`)
      )
      .addTo(map);
  });
  return (
    <div id="map" className="flex-1" style="height: 700px; flex: 3;" {...rest}></div>
  );
};

export const AssignToPatient: Component = () => {
  return <div>{/* <Map /> */}</div>;
};
