import client from "../client";

const endpoint = "/banners";

const getBanners = () => client.get(`${endpoint}`);
const getBannerById = (id) => client.get(`${endpoint}/${id}`);

export default {
  getBanners,
  getBannerById,
};
