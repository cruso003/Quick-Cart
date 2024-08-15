import client from "../client";

const endpoint = "/store";
const storeEndpoint = "/store/storeName";

const getStoreByName = (store) => client.get(`${storeEndpoint}/${store}`);
const getStoreById = (storeId) => client.get(`${endpoint}/${storeId}`);

export default {
  getStoreByName,
  getStoreById,
};
