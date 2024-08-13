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
    login: "/admin/login",
};

const userRoutes = {
    getUsers: "/user/get-users",
    getUserById: "/user/:userId",
    updateUserByEmail: "/user/:email",
    forgotPassword: "/user/forgot-password",
    verifyOtpAndResetPassword: "/user/verify-otp-reset-password",
    resendSecurityCode: "/user/resend-security-code",
}

const productRoutes = {
    getProducts: "/products",
    createProduct: "/products",
    deleteProduct: "/products/:id",
    updateProduct: "/products/:id",
}

const categoryRoutes = {
    getCategories: "/categories",
}

const categoryApiRequests = {
    getCategories: async (): Promise<AxiosResponse<any>> => {
        return globalApi.get(categoryRoutes.getCategories);
    },
}

const productApiRequests = {
    getProducts: async (): Promise<AxiosResponse<any>> => {
      return globalApi.get(productRoutes.getProducts);
    },
    createProduct: async (productData: FormData): Promise<AxiosResponse<any>> => {
      return globalApi.post(productRoutes.createProduct, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    deleteProduct: async (productId: string): Promise<AxiosResponse<any>> => {
      return globalApi.delete(productRoutes.deleteProduct.replace(":id", productId));
    },
    updateProduct: async (productId: string, updatedProductData: any): Promise<AxiosResponse<any>> => {
      return globalApi.put(productRoutes.updateProduct.replace(":id", productId), updatedProductData);
    },
  };
  
// Functions to make API requests for authentication
const authApiRequests = {
    loginAdmin: async (email: string, password: string): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.login, { email, password });
    },
};

// Functions to make API requests for users
const userApiRequest = {
    getUsers: async (params?: any): Promise<AxiosResponse<any>> => {
        return globalApi.get(userRoutes.getUsers, { params });
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
    productApiRequests,
    categoryApiRequests,
};
