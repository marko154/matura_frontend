import { client } from "./client";

export const createMentor = async (mentor: Mentor) => {
	return await client("mentor/create", { body: mentor });
};

type MentorData = Mentor & { user: User };
type Response = { mentors: MentorData[]; total: number };

export const getMentors = async (page: number): Promise<Response> => {
	// return new Promise((res) => {
	// 	setTimeout(() => res({ data: [{ name: "123" }] }), 1000);
	// });
	if (typeof page !== "number") page = 1;
	return await client("mentor/all", {
		URLParams: {
			page,
			limit: 10,
		},
	});
};

export const getMentor = async (id: string) => {
	return await client(`mentor/${id}`);
};

export const deleteMentor = async (id: string) => {
	return await client(`mentor/${id}`, { method: "DELETE" });
};

export { MentorData, Response };
