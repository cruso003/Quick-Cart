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
    login: "auth/login/admin",
    createAdmin: "auth/admin/create"
};

const userRoutes = {
    getUsers: "/user/get-users",
    getUserById: "/user/:userId",
    updateUserByEmail: "/user/:email",
    forgotPassword: "/user/forgot-password",
    verifyOtpAndResetPassword: "/user/verify-otp-reset-password",
    resendSecurityCode: "/user/resend-security-code",
};

const productRoutes = {
    getProducts: "/products",
    createProduct: "/products",
    deleteProduct: "/products/:id",
    updateProduct: "/products/:id",
};

const categoryRoutes = {
    getCategories: "/categories",
    createCategory: "/categories/create",
    deleteCategory: "/categories/:id",
};

const subcategoryRoutes = {
    getSubcategories: "/subcategories",
    createSubcategory: "/subcategories/create",
    deleteSubcategory: "/subcategories/:id",
}

const bannerRoutes = {
    getBanners: "/banners",
    getBannerById: "/banners/:id",
    uploadBanner: "/banners",
    updateBanner: "/banners/:id",
    deleteBanner: "/banners/:id",
};

const categoryApiRequests = {
    getCategories: async (): Promise<AxiosResponse<any>> => {
        return globalApi.get(categoryRoutes.getCategories);
    },
    createCategory: async (categoryData: FormData): Promise<AxiosResponse<any>> => {
        return globalApi.post(categoryRoutes.createCategory, categoryData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteCategory: async (categoryId: string): Promise<AxiosResponse<any>> => {
        return globalApi.delete(categoryRoutes.deleteCategory.replace(":id", categoryId));
    }
};

const subcategoryApiRequests = {
    getSubcategories: async (): Promise<AxiosResponse<any>> => {
        return globalApi.get(subcategoryRoutes.getSubcategories);
    },
    createSubcategory: async (subcategoryData: FormData): Promise<AxiosResponse<any>> => {
        return globalApi.post(subcategoryRoutes.createSubcategory, subcategoryData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteSubcategory: async (subcategoryId: string): Promise<AxiosResponse<any>> => {
        return globalApi.delete(subcategoryRoutes.deleteSubcategory.replace(":id", subcategoryId));
    }
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
    createAdmin: async (adminData: any): Promise<AxiosResponse<any>> => {
        return globalApi.post(authRoutes.createAdmin, adminData);
    },
};

// Functions to make API requests for users
const userApiRequest = {
    getUsers: async (params?: Record<string, any>): Promise<AxiosResponse<any>> => {
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
};

// Functions to make API requests for banners
const bannerApiRequests = {
    getBanners: async (): Promise<AxiosResponse<any>> => {
        return globalApi.get(bannerRoutes.getBanners);
    },
    getBannerById: async (bannerId: string): Promise<AxiosResponse<any>> => {
        return globalApi.get(bannerRoutes.getBannerById.replace(":id", bannerId));
    },
    uploadBanner: async (bannerData: FormData): Promise<AxiosResponse<any>> => {
        return globalApi.post(bannerRoutes.uploadBanner, bannerData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateBanner: async (bannerId: string, bannerData: FormData): Promise<AxiosResponse<any>> => {
        return globalApi.put(bannerRoutes.updateBanner.replace(":id", bannerId), bannerData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteBanner: async (bannerId: string): Promise<AxiosResponse<any>> => {
        return globalApi.delete(bannerRoutes.deleteBanner.replace(":id", bannerId));
    },
};

export {
    authApiRequests,
    userApiRequest,
    productApiRequests,
    categoryApiRequests,
    subcategoryApiRequests,
    bannerApiRequests,
};
