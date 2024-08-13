import client from "../client";

const login = (email, password) => client.post("/auth/login", { email, password });
const register = (user) => client.post("/auth/register", user);

export default {
  login,
  register
};
