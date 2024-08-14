import client from "../client";

const endpoint = "/products";

const getProducts = () => client.get(endpoint);
const getStoreById = (id) => client.get(`/stores/${id}`, id);
export default {
  getProducts,
  getStoreById
};
