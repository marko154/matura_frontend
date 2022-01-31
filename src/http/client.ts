import { ACCESS_TOKEN_KEY } from "../constants/localStorage";

type Config = Omit<RequestInit, "body"> & {
	body?: object;
};

function client(endpoint: string, { body, ...customConfig }: Config = {}) {
	const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
	const headers: HeadersInit = { "content-type": "application/json" };
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	const config: RequestInit = {
		method: body ? "POST" : "GET",
		...customConfig,
		headers: {
			...headers,
			...customConfig.headers,
		},
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	return window
		.fetch(`${import.meta.env.SOLID_APP_API_URL}/${endpoint}`, config)
		.then(async (response) => {
			if (response.ok) {
				return await response.json();
			} else {
				const errorMessage = await response.json();
				return Promise.reject(errorMessage);
			}
		});
}

export { client };
