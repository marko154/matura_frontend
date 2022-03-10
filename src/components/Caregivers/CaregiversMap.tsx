import { Component, For, onMount } from "solid-js";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import { Sidebar } from "../Sidebar/Sidebar";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

const list = {
  markers: [
    { name: "Lol", coordinates: [46.04869247806667, 14.503326746179125] },
  ],
};
export const CaregiversMap: Component = () => {
  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [14.5, 46.04869247806667], // starting position [lng, lat]
      zoom: 8, // starting zoom
    });
  });
  return (
    <div>
      <div id="map" className="flex-1"></div>;<Sidebar className=""></Sidebar>
    </div>
  );
};
