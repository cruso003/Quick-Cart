import client from "../client";

// Define API calls
const getAllUsers = () => client.get("/user/get-users");
const getUserById = (userId) => client.get(`/user/${userId}`);
const updateUserByEmail = (email, userData) => client.put(`/user/${email}`, userData);
const addDeliveryAddress = (email, address) => client.post(`/user/${email}/delivery-address`, address);
const updateAddressById = (addressId, addressData) => client.put(`/user/address/${addressId}`, addressData);
const removeAddressById = (addressId) => client.delete(`/user/delete-address/${addressId}`);
const forgotPassword = (email) => client.post("/user/forgot-password", { email });
const verifyOtpAndResetPassword = (data) => client.post("/user/verify-otp-reset-password", data);
const resendSecurityCode = (email) => client.post("/user/resend-security-code", { email });

export default {
  getAllUsers,
  getUserById,
  updateUserByEmail,
  addDeliveryAddress,
  updateAddressById,
  removeAddressById,
  forgotPassword,
  verifyOtpAndResetPassword,
  resendSecurityCode
};
