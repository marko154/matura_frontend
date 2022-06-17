import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component, createEffect, JSX, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { formatDate } from "../../utils/strings.utils";
import { Segment } from "../Caregiver/AccountInfo";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import { TextArea } from "../common/Textarea/TextArea";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { updatePatient } from "../../http/patients";
import { toast } from "../common/Toast/Toast";
import { useAuth } from "../../context/AuthProvider";
import { isAdmin } from "../../utils/roles.utils";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

type MapProps = JSX.IntrinsicElements["div"] & {
  onResult: (res: {
    place_name: string;
    location_id: string;
    coordinates: [number, number];
  }) => void;
  coordinates: [number, number];
};

export const Map: Component<MapProps> = ({ coordinates, onResult, ...rest }) => {
  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: coordinates, // starting position [lng, lat]
      zoom: 8.5, // starting zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      // @ts-ignore
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: "Search for an address",
    });

    map.addControl(geocoder);
    const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    geocoder.on("result", (e) => {
      const { place_name, id: location_id, center: coordinates } = e.result;
      onResult({ place_name, location_id, coordinates });
      marker1.setLngLat(coordinates);
    });
  });

  return <div id="map" class="rounded-md" style="height: 480px;" {...rest}></div>;
};

type PatientInfoProps = {
  patient: Patient & { location: Location };
  refetchPatient: () => void;
};

export const PatientInfo: Component<PatientInfoProps> = ({ patient, refetchPatient }) => {
  const [t] = useI18n();
  const [{ user }] = useAuth();
  const initialState = {
    first_name: patient.first_name,
    last_name: patient.last_name,
    date_of_birth: patient.date_of_birth,
    phone_number: patient.phone_number,
    email: patient.email,
    details: patient.details,
    location: patient.location,
  };
  const [state, setState] = createStore({ ...initialState });

  const handleSaveChanges = async () => {
    try {
      const serialiezed = JSON.parse(JSON.stringify(state));
      // if the location didn't change, don't include it in the request
      if (state.location.location_id === patient.location_id) {
        delete serialiezed.location;
      }
      console.log(serialiezed);
      await updatePatient(patient.patient_id, serialiezed);
      toast({ text: "Succesfully updated" });
      refetchPatient();
    } catch (err) {
      toast({ text: "Saving failed." });
    }
  };

  const handleCancel = () => {
    setState(initialState);
  };

  const handleChange = (e: any) => {
    setState(e.target.name, e.target.value);
  };

  const wereChangesMade = () => {
    return (
      state.first_name !== patient.first_name ||
      state.last_name !== patient.last_name ||
      state.date_of_birth !== patient.date_of_birth ||
      state.phone_number !== patient.phone_number ||
      state.email !== patient.email ||
      state.details !== patient.details ||
      state.location.location_id !== patient.location_id
    );
  };

  return (
    <div class="mb-9">
      <div className="flex justify-end pt-9 pb-2 gap-3">
        <h2 className="mr-auto text-lg text-gray-700 ml-7">{t("mentor.personalInfo")}</h2>
        {isAdmin(user!) && (
          <>
            <Button
              action="secondary"
              disabled={!wereChangesMade()}
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
            <Button disabled={!wereChangesMade()} onClick={handleSaveChanges}>
              {t("saveChanges")}
            </Button>
          </>
        )}
      </div>
      <Segment title={t("user.name")}>
        <Input
          version="secondary"
          name="first_name"
          value={state.first_name}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
        <Input
          version="secondary"
          name="last_name"
          value={state.last_name}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
      </Segment>

      <Segment title={t("user.emailAddress")}>
        <Input
          version="secondary"
          value={patient.email || "Not set"}
          name="email"
          onInput={handleChange}
          style="min-width: 464px"
          disabled={!isAdmin(user!)}
        />
      </Segment>

      <Segment title={t("user.phoneNumber")}>
        <Input
          version="secondary"
          type="tel"
          name="phone_number"
          value={state.phone_number || "Not set"}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
      </Segment>
      <Segment title={t("user.dateOfBirth")}>
        <Input
          version="secondary"
          value={formatDate(patient.date_of_birth)}
          disabled={!isAdmin(user!)}
        />
      </Segment>

      <Segment title={"Details"}>
        <TextArea
          style="width: 464px"
          version="secondary"
          value={patient.details || ""}
          name="details"
          onInput={handleChange}
        ></TextArea>
      </Segment>

      <div className="px-7 py-5 border-b border-gray-200 flex">
        <div className="uppercase flex mr-9 w-44 text-gray-700">{"Address"}</div>

        <div className="flex flex-1 flex-col gap-7">
          <div class="text-gray-700">{state.location.place_name}</div>
          <Map
            coordinates={state.location.coordinates as [number, number]}
            onResult={(res) => setState("location", res)}
          />
        </div>
      </div>
    </div>
  );
};
