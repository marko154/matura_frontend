import { client } from "./client";

const getLocations = async (): Promise<
  {
    caregiver_id: number | null;
    patient_id: number | null;
    long: number;
    lat: number;
  }[]
> => {
  return await client("patient/all-locations");
};

export { getLocations };
