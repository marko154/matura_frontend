import { client } from "./client";

const register = async (userData: { email: string; password: string }) => {
	await client("user/register", { body: userData });
};

const login = async (userData: { email: string; password: string }) => {
	// return await new Promise((resolve) =>
	// 	setTimeout(
	// 		() => resolve({ email: "joe@gmail.com", display_name: "joe" }),
	// 		1000
	// 	)
	// );
	return await client("user/login", { body: userData });
};

const googleLogin = async (id_token: string) => {
	return await client("user/google-login", { body: { id_token } });
};

const getUser = async (): Promise<any> => {
	return await client("user/");
	// return await new Promise((resolve) =>
	// 	setTimeout(() => resolve(null), 1000)
	// );
};

export { register, login, googleLogin, getUser };
