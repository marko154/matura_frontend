import { Component, JSX, onMount } from "solid-js";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

type MapProps = JSX.IntrinsicElements["div"] & {
  onResult: (res: {
    place_name: string;
    location_id: string;
    coordinates: [number, number];
  }) => void;
};

export const Map: Component<MapProps> = ({ onResult, ...rest }) => {
  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [14.5, 46.04869247806667], // starting position [lng, lat]
      zoom: 8, // starting zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      // @ts-ignore
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: "Search for an address",
    });

    map.addControl(geocoder);
    // limit results to only residential or business adresses
    geocoder.setTypes("address");
    geocoder.on("result", (e) => {
      const { place_name, id: location_id, center: coordinates } = e.result;
      onResult({ place_name, location_id, coordinates });
    });
  });
  return <div id="map" className="flex-1 rounded-md" {...rest}></div>;
};
