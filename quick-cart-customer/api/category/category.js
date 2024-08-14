import client from "../client";

// Define API calls
const getCategories = () => client.get("/categories");

export default {
  getCategories,
};