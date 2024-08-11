import axios, { AxiosResponse } from 'axios';

const ServerUrl = "http://localhost:9000/api/v1";

// Create axios instance with server url
const globalApi = axios.create({
    baseURL: ServerUrl,
    withCredentials: true,
});

// Define API routes
const authRoutes = {
    login: "/auth/login",
    createVendor: "/auth/seller",
};

// Functions to make API requests for authentication
const authApiRequests = {
    loginVendor: async (email: string, password: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.login, { email, password });
    },
    createVendor: async (vendorData: {
        name: string,
        email: string,
        password: string,
        businessName: string,
        phoneNumber: string,
        address: string,
        city: string,
        state: string,
    }): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.createVendor, vendorData);
    },
};

export {
    authApiRequests,
};
