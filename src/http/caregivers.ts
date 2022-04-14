import { client } from "./client";

export const getCaregivers = async (page: number) => {
  if (typeof page !== "number") page = 1;
  return await client("caregiver/all", {
    URLParams: {
      limit: 10,
      page,
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

export const getClosestPatients = async (caregiver_id: string) => {
  return await client(`caregiver/${caregiver_id}/closest-patients`);
};

export const checkEmsoAvailable = async (emso: string) => {
  return await client(`caregiver/emso-available/${emso}`);
};

export const deleteCaregiver = async (id: string) => {
  return await client(`caregiver/${id}`, { method: "DELETE" });
};
