import { client } from "./client";

export const getAllSessions = async (params: {
  search: string;
  page: number;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<(Session & { caregiver: Caregiver; patient: Patient })[]> => {
  return client("patient/all-sessions", {
    URLParams: {
      limit: 10,
      ...params,
    },
  });
};

export const createSession = async (fields: {
  notes: string;
  patient_id: number;
  caregiver_id: number;
}) => {
  return client("patient/create-session", { body: fields });
};
