import client from "../client";

const login = (email, password) => client.post("/auth/logi", { email, password });
const register = (user) => client.post("/auth/register", user);

export default {
  login,
  register
};
