import { Component, createEffect, createResource, onMount } from "solid-js";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { getLocations } from "../../http/locations";
import { itemToGeoJSONPoint } from "../../utils/mapbox.utils";
import { Avatar } from "../common/Avatar";
import { render } from "solid-js/web";
import { getCaregiver } from "../../http/caregivers";
import { Loader } from "../common/Loader/Loader";
import { Icon } from "../common/Icon";
import { getPatient } from "../../http/patients";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

const Popup: Component<{
  caregiver_id: number | undefined;
  patient_id: number | undefined;
}> = ({ caregiver_id, patient_id }) => {
  if (caregiver_id !== undefined) {
    const [caregiver] = createResource(() => getCaregiver(String(caregiver_id)));
    createEffect(() => {
      console.log(caregiver());
    });

    return (
      <div class="px-2 pt-2 pb-0 flex flex-col gap-1 justify-center items-center">
        {caregiver.loading ? (
          <Loader />
        ) : caregiver.error ? (
          <div>An error has occured</div>
        ) : (
          <>
            <h2>Caregiver</h2>
            <Avatar imageURL={undefined} size="w-14 h-14" />
            <a href={`/caregiver/${caregiver_id}`} class="flex">
              <div class="font-bold">{`${caregiver()!.first_name} ${
                caregiver()!.last_name
              }`}</div>
              {/* <div>{caregiver()?.location.place_name}</div> */}
              <span class="ml-1">
                <Icon name="arrow_forward" />
              </span>
            </a>
          </>
        )}
      </div>
    );
  }
  const [patient] = createResource(() => getPatient(String(patient_id)));
  createEffect(() => {
    console.log(patient());
  });

  return (
    <div class="px-2 pt-2 pb-0 flex flex-col gap-1 justify-center items-center">
      {patient.loading ? (
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

export const HomeMap: Component = ({ ...rest }) => {
  const [locations] = createResource(getLocations);
  let map: mapboxgl.Map;

  onMount(() => {
    map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [14.8, 46.1], // starting position [lng, lat]
      zoom: 7.25, // starting zoom
    });
  });

  createEffect(() => {
    if (!locations()) return;

    const geoJSONLocations = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: locations()!.map((loc) => itemToGeoJSONPoint(loc)),
    };

    map.on("load", () => {
      map.addSource("locations", {
        type: "geojson",
        data: geoJSONLocations,
        //  "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "locations",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            10,
            "#f1f075",
            20,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "locations",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#51bbd6",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties!.cluster_id;
        map.getSource("locations").getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const location: any = e.features[0].properties;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupNode = document.createElement("div");
        render(() => <Popup {...location} />, popupNode);
        new mapboxgl.Popup({ closeButton: false })
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  });

  return (
    <div
      id="map"
      className="flex-1 rounded-md"
      style="height: 45vh; flex: 3;"
      {...rest}
    ></div>
  );
};
