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

const requestPasswordReset = async (email: string) => {
  return await client("user/request-password-reset", { body: { email } });
};

const resetPassword = async (token: string, newPassword: string) => {
  return await client("user/reset-password", {
    body: { token, newPassword },
  });
};

const checkEmailAvailable = async (email: string) => {
  return await client(`user/email-available/${email}`);
};

const getRecentUsers = async () => {
  return await client("user/recent-users");
};

export {
  register,
  login,
  googleLogin,
  getUser,
  resetPassword,
  requestPasswordReset,
  checkEmailAvailable,
  getRecentUsers,
};
