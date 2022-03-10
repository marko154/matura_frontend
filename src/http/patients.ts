import { client } from "./client";

export const createPatient = async (patient: Patient) => {
  return await client("patient/create", { body: patient });
};

export const getPatient = async (
  id: string
): Promise<Patient & { location: Location }> => {
  return await client(`patient/${id}`);
};

export type Response = { patients: Patient[]; total: number };
export type QueryParams = { page: number; search: string };

export const getPatients = async (params: QueryParams): Promise<Response> => {
  return await client("patient/all", {
    URLParams: {
      limit: 10,
      ...params,
    },
  });
};

export const getClosestCaregivers = async (location_id: string) => {
  return await client(`patient/${location_id}/closest-caregivers`);
};

export const getSessions = async (
  patient_id: string
): Promise<(Session & { caregiver: Caregiver & { user: User } })[]> => {
  return await client(`patient/${patient_id}/sessions`);
};

export const getEmergencyContacts = async (
  patient_id: string | number
): Promise<Contact[]> => {
  return await client(`patient/${patient_id}/contacts`);
};

export const updatePatient = async (patient_id: string | number, fields: any) => {
  return await client(`patient/${patient_id}`, { method: "PATCH", body: fields });
};

export const assignCaregiver = (session: Session) => {
  return client("assign-caregiver", { body: session });
};

export const addContacts = async (patient_id: string | number, contacts: any[]) => {
  return client(`patient/${patient_id}/add-contacts`, { body: contacts });
};
