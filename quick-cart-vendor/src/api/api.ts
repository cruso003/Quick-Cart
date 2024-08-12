/* eslint-disable @typescript-eslint/no-explicit-any */
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

const userRoutes = {
    getUsers: "/user/get-users",
    getUserById: "/user/:userId",
    updateUserByEmail: "/user/:email",
    forgotPassword: "/user/forgot-password",
    verifyOtpAndResetPassword: "/user/verify-otp-reset-password",
    resendSecurityCode: "/user/resend-security-code",
}

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

// Functions to make API requests for users
const userApiRequest = {
    getUsers: async (): Promise<AxiosResponse<any>> => {
        return globalApi.get(userRoutes.getUsers);
    },
    getUserById: async (userId: string): Promise<AxiosResponse<any>> => {
        return globalApi.get(userRoutes.getUserById.replace(":userId", userId));
    },
    updateUserByEmail: async (email: string, updatedUserData: any): Promise<AxiosResponse<any>> => {
        return globalApi.put(userRoutes.updateUserByEmail.replace(":email", email), updatedUserData);
    },
    forgotPassword: async (email: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(userRoutes.forgotPassword, { email });
    },
    verifyOtpAndResetPassword: async (email: string, securityCode: string, newPassword: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(userRoutes.verifyOtpAndResetPassword, { email, securityCode, newPassword });
    },
    resendSecurityCode: async (email: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(userRoutes.resendSecurityCode, { email });
    },
}

export {
    authApiRequests,
    userApiRequest,
};
