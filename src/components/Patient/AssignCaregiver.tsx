import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  JSX,
  onMount,
} from "solid-js";
import { getClosestCaregivers } from "../../http/patients";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./AssignCaregiver.css";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";
import { render } from "solid-js/web";
import { Button } from "../common/Button/Button";
import { TextArea } from "../common/Textarea/TextArea";
import { toast } from "../common/Toast/Toast";
import { createSession } from "../../http/sessions";
import { Input } from "../common/Input/Input";
import { isAvailable } from "../../utils/schedualing.utils";

mapboxgl.accessToken = import.meta.env.SOLID_APP_MAPBOX_API_KEY;

const Popup: Component<{ caregiver: CaregiverWithLocation }> = ({ caregiver }) => {
  return (
    <>
      <Avatar imageURL={undefined} size="w-9 h-9" />
      <div class="font-sans mt-2 -mb-1">{`${caregiver.first_name} ${caregiver.last_name}`}</div>
    </>
  );
};

type CaregiverWithLocation = Caregiver & {
  long: number;
  lat: number;
  place_name: string;
  distance: number;
};

type MapProps = JSX.IntrinsicElements["div"] & {
  caregivers: CaregiverWithLocation[];
  patient: Patient & { location: Location };
  selectedCaregiver: CaregiverWithLocation | null;
  setSelectedCaregiver: (val: CaregiverWithLocation | null) => void;
};

const Map: Component<MapProps> = ({
  caregivers,
  patient,
  selectedCaregiver,
  setSelectedCaregiver,
  ...rest
}) => {
  // @ts-ignore
  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: "metric",
    interactive: false,
    controls: {
      inputs: false,
      instructions: false,
    },
  });
  directions.setOrigin(patient.location.coordinates);

  createEffect(() => {
    if (!selectedCaregiver) return;
    directions.setDestination([selectedCaregiver.long, selectedCaregiver.lat]);
  });

  let map: mapboxgl.Map;

  onMount(() => {
    map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: patient.location.coordinates, // starting position [lng, lat]
      zoom: 8, // starting zoom
    });
    map.addControl(directions, "top-left");
  });

  createEffect(() => {
    // add markers to map
    for (const caregiver of caregivers) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";
      el.onclick = () => {
        setSelectedCaregiver(caregiver);
      };

      // make a marker for each feature and add it to the map
      const popupNode = document.createElement("div");
      render(() => <Popup caregiver={caregiver} />, popupNode);
      new mapboxgl.Marker(el)
        .setLngLat([caregiver.long, caregiver.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: false }).setDOMContent(popupNode)
        )
        .addTo(map);
    }
    const el = document.createElement("div");
    el.className = "marker patient-marker";

    new mapboxgl.Marker(el)
      .setLngLat(patient.location.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`<h3>${patient.first_name}</h3><p>${patient.last_name}</p>`)
      )
      .addTo(map);
  });
  return (
    <div id="map" className="flex-1" style="height: 700px; flex: 3;" {...rest}></div>
  );
};

type Props = {
  patient: Patient & { location: Location };
};
// TODO: scroll to selected user onchange on map select
export const AssignCaregiver: Component<Props> = ({ patient }) => {
  // const [caregivers, {}] = createResource<CaregiverWithLocation[], string>(
  //   patient.location_id,
  //   getClosestCaregivers
  // );

  const [caregivers, setCaregivers] = createSignal<any[]>([]);
  const [caregiversLoading, setCaregiversLoading] = createSignal(false);
  const [done, setDone] = createSignal(false);
  const [error, setError] = createSignal<any>(null);
  const [offset, setOffset] = createSignal(0);

  createEffect(async () => {
    setCaregiversLoading(true);
    try {
      const newCaregivers = await getClosestCaregivers(patient.location_id!, offset());
      setCaregivers([...caregivers(), ...newCaregivers]);
      if (newCaregivers.length < 10) setDone(true);
    } catch (err) {
      setError(err);
    }
    setCaregiversLoading(false);
  });

  const [selected, setSelected] = createSignal<CaregiverWithLocation | null>(null);
  const [notes, setNotes] = createSignal("");
  const [duration, setDuration] = createSignal("01:00");
  const [loading, setLoading] = createSignal(false);

  const handleAssign = async () => {
    try {
      setLoading(true);
      await createSession({
        caregiver_id: selected()!.caregiver_id,
        notes: notes(),
        duration: duration(),
        patient_id: patient.patient_id,
      });
      toast({ text: "Successfully assigned" });
    } catch (err) {
      toast({ text: "Error" });
    }
    setLoading(false);
  };

  createEffect(() => {
    console.log(caregivers());
    if (caregivers()) {
      setSelected(caregivers()![0]);
    }
  });

  return (
    <>
      {caregiversLoading() && offset() === 0 ? (
        <Loader />
      ) : error() ? (
        <Message type="error">There was an error</Message>
      ) : (
        <div class="flex">
          <Map
            caregivers={caregivers()}
            selectedCaregiver={selected()}
            patient={patient}
            setSelectedCaregiver={setSelected}
          />
          <aside
            class="overflow-y-auto flex-1"
            style="max-height: 700px; min-width: 380px;"
          >
            <For each={caregivers()}>
              {(caregiver) => {
                const isSelected = () =>
                  caregiver.caregiver_id === selected()?.caregiver_id;
                return (
                  <div
                    class="py-5 px-4 hover:bg-gray-100 flex cursor-pointer relative w-full"
                    onClick={() => setSelected(caregiver)}
                    classList={{ "bg-gray-100": isSelected() }}
                  >
                    <a
                      href={"/caregiver/" + caregiver.caregiver_id}
                      target="_blank"
                      class="absolute top-2 right-2 hover:bg-gray-200 px-2 rounded"
                    >
                      <Icon name="subdirectory_arrow_right" />
                    </a>

                    <Avatar imageURL={undefined} />
                    <div class="ml-4 items-center">
                      <div class="text-lg">{`${caregiver.first_name} ${caregiver.last_name}`}</div>
                      <div class="text-gray-600 text-sm">{caregiver.place_name}</div>
                      <div class="text-gray-600">
                        {(caregiver.distance * 111).toFixed(2) + " km"}
                      </div>
                      {isSelected() && (
                        <div class="mt-4 mb-3">
                          <div class="uppercase mb-3">
                            {isAvailable(caregiver.availibilities)
                              ? "Currently Available"
                              : "Currently Unavailable"}
                          </div>
                          <Input
                            type="time"
                            version="secondary"
                            label="Expected Duration"
                            value={duration()}
                            onChange={(e) => setDuration(e.currentTarget.value)}
                          />
                          <TextArea
                            className="mt-2"
                            version="secondary"
                            placeholder="Details about the session..."
                            onInput={(e) => setNotes(e.currentTarget.value)}
                          ></TextArea>
                          <Button
                            className="ml-auto w-full"
                            onClick={handleAssign}
                            loading={loading()}
                            disabled={loading()}
                          >
                            Assign
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </For>
            {!done() && (
              <button
                class="rounded bg-gray-100 py-4 h-16 w-full items-center relative outline-none"
                onClick={() => setOffset(offset() + 10)}
              >
                {caregiversLoading() ? <Loader /> : "Load More"}
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
};
