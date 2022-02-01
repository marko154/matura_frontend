import { client } from "./client";

export const createMentor = async (mentor: Mentor) => {
	return await client("mentor/create", { body: mentor });
};

export const getMentors = async (): Promise<{ data: any }> => {
	// return new Promise((res) => {
	// 	setTimeout(() => res({ data: [{ name: "123" }] }), 1000);
	// });
	return await client("mentor/all", {
		URLParams: {
			limit: 20,
			page: 1,
		},
	});
};
