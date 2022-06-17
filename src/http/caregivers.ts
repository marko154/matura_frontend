import { AvailibilityFields } from "../components/CreateCaregiver/SelectAvailability";
import { client } from "./client";

export type QueryParams = { page: number; search: string };

export const getCaregivers = async (params: QueryParams) => {
  return await client("caregiver/all", {
    URLParams: {
      limit: 10,
      ...params,
    },
  });
};

export const getCaregiver = async (
  id: string
): Promise<Caregiver & { user: User; mentor: Mentor; location: Location }> => {
  return await client(`caregiver/${id}`);
};

export const createCaregiver = async (caregiver: any) => {
  return await client("caregiver/create", { body: caregiver });
};

export const updateCaregiver = async (
  id: string | number,
  fields: {
    caregiver_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    location: any;
  }
) => {
  return await client(`caregiver/${id}`, { method: "PATCH", body: fields });
};

export const getSessions = async (
  caregiver_id: string
): Promise<(Session & { patient: Patient })[]> => {
  return await client(`caregiver/${caregiver_id}/sessions`);
};

export const getAvailibility = async (
  caregiver_id: string
): Promise<(Term & { Availibility: Availibility[] })[]> => {
  return await client(`caregiver/${caregiver_id}/availibility`);
};

export const createTermAvailibility = async (fields: {
  caregiver_id: string;
  term_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}) => {
  return await client(`caregiver/${fields.caregiver_id}/term-availibility`, {
    body: {
      ...fields,
      start_time: new Date(`1.1.1970 ${fields.start_time}`).toISOString(),
      end_time: new Date(`1.1.1970 ${fields.end_time}`).toISOString(),
    },
  });
};

export const createAvailibilities = async (
  caregiver_id: string,
  availibility: AvailibilityFields
) => {
  return await client(`caregiver/${caregiver_id}/availibility`, {
    body: [availibility],
  });
};

export const getClosestPatients = async (caregiver_id: string) => {
  return await client(`caregiver/${caregiver_id}/closest-patients`);
};

export const checkEmsoAvailable = async (emso: string) => {
  return await client(`caregiver/emso-available/${emso}`);
};

export const deleteCaregiver = async (id: string) => {
  return await client(`caregiver/${id}`, { method: "DELETE" });
};

export const deleteAvailibility = async (availibility_id: number) => {
  return await client(`caregiver/availibility/${availibility_id}`, { method: "DELETE" });
};
