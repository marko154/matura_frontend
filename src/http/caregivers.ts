import { client } from "./client";

export const getCaregivers = async () => {
	return new Promise((res) => {
		setTimeout(() => res({ total_pages: 2, data: { name: "123" } }), 1000);
	});
	// return await client("admin/caregivers/", {
	// 	URLParams: {
	// 		limit: 20,
	// 		page: 1,
	// 	},
	// });
};
