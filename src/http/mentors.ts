import { client } from "./client";

export const createMentor = async (mentor: Mentor) => {
  return await client("mentor/create", { body: mentor });
};

export type MentorData = Mentor & { user: User };
export type Response = { mentors: MentorData[]; total: number };
export type QueryParams = { page: number; search: string };

export const getMentors = async (params: QueryParams): Promise<Response> => {
  return await client("mentor/all", {
    URLParams: {
      limit: 10,
      ...params,
    },
  });
};

export const getMentor = async (id: string): Promise<Mentor & { user: User }> => {
  return await client(`mentor/${id}`);
};

export const getCaregivers = async (id: string) => {
  return await client(`mentor/${id}/caregivers`);
};

export const getAssignableCaregivers = async (params: {
  id: string;
  type: "all" | "unassigned";
  search: string;
  skip: number;
  take: number;
}) => {
  return await client(`mentor/assignable-caregivers`, { URLParams: params });
};

export const deleteMentor = async (id: string) => {
  return await client(`mentor/${id}`, { method: "DELETE" });
};

export const updateMentor = async (fields: {
  mentor_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
}) => {
  return await client("mentor", { method: "PATCH", body: fields });
};

export const assignCaregivers = async (id: string, caregivers: number[]) => {
  return await client(`mentor/${id}/assign-caregivers`, { body: { caregivers } });
};

export const unassignCaregivers = async (id: string, caregivers: number[]) => {
  return await client(`mentor/unassign-caregivers`, { body: { caregivers } });
};
