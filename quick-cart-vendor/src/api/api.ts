import axios, { AxiosResponse } from 'axios';

const ServerUrl = 'http://locathost:9000/api/v1';

//Create axios instance with server url
const globalApi = axios.create({
    baseURL: ServerUrl,
    withCredentials: true,
});

// Define API routes
const authRoutes = {
    login: "/auth/user",
    createVendor: "/auth/seller",
};

// Functions to make API requests for authentication
const authApiRequests = {
    loginVendor: async (email: string, password: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.login, { email, password });
    },
    createVendor: async (email: string, password: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.createVendor, { email, password });
    },
};

export {
    authApiRequests,
}
