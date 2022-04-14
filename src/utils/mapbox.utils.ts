export function itemToGeoJSONPoint(item: {
  long: number;
  lat: number;
  [x: string | number | symbol]: unknown;
}) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [item.long, item.lat],
    },
    properties: item,
  };
}
