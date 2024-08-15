import client from "../client";

const endpoint = "/stores";
const storeEndpoint = "/stores/storeName";

const getStoreByName = (store) => client.get(`${storeEndpoint}/${store}`);
const getStoreById = (storeId) => client.get(`${endpoint}/${storeId}`);

export default {
  getStoreByName,
  getStoreById,
};
