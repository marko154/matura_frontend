import { client } from "./client";

export const getCaregivers = async (page = 1) => {
	// return new Promise((res) => {
	// 	setTimeout(() => res({ total_pages: 2, data: { name: "123" } }), 1000);
	// });
	return await client("/caregiver/all", {
		URLParams: {
			limit: 10,
			page,
		},
	});
};

export const getCaregiver = async (id: string) => {
	return await client(`caregiver/${id}`);
};

export const createCaregiver = async (caregiver: any) => {
	return await client("caregiver/create", { body: caregiver });
};

export const deleteCaregiver = async (id: string) => {
	return await client(`caregiver/${id}`, { method: "DELETE" });
};
