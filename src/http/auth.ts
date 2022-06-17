import { client } from "./client";

const register = async (userData: { email: string; password: string }) => {
  await client("user/register", { body: userData });
};

const login = async (userData: { email: string; password: string }) => {
  return await client("user/login", { body: userData });
};

const googleLogin = async (id_token: string) => {
  return await client("user/google-login", { body: { id_token } });
};

const getUser = async (): Promise<any> => {
  return await client("user/");
};

const requestPasswordReset = async (email: string) => {
  return await client("user/request-password-reset", { body: { email } });
};

const resetPassword = async (token: string, newPassword: string) => {
  return await client("user/reset-password", {
    body: { token, newPassword },
    method: "PATCH",
  });
};

const checkEmailAvailable = async (email: string) => {
  return await client(`user/email-available/${email}`);
};

const getRecentUsers = async () => {
  return await client("user/recent-users");
};

const adminCreateUser = async (data: {
  email: string;
  user_type_id: number;
  display_name: string | null;
}) => {
  return await client("user/create-user", { body: data });
};

const verifyToken = async (token: string) => {
  return await client(`user/verify/${token}`);
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
  adminCreateUser,
  verifyToken,
};
