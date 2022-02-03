import { client } from "./client";

export const createPatient = async (patient: Patient) => {
	return await client("patient/create", { body: patient });
};

export const getPatient = async (id: string) => {
	return await client(`patient/${id}`);
};

export type Response = { patients: Patient[]; total: number };

export const getPatients = async (page: number): Promise<Response> => {
	if (typeof page !== "number") page = 1;
	return await client("patient/all", {
		URLParams: {
			page,
			limit: 10,
		},
	});
};
