import client from "../client";
import authStorage from "../../context/storage";

const endpoint = "/cart";

const addToCart = (data) => client.post(endpoint, data);
const deleteCartItem = (id) => client.delete(`${endpoint}/${id}`);
const removeCartItems = async ({ userId, itemIds }) => {
  try {
    // Ensure URL consistency with client instance base URL
    const response = await client.delete(`/cart/user/${userId}/deleteMultiple`, {
      data: { itemIds },
      headers: {
        "x-auth-token": await authStorage.getToken(),
      },
    });

    // Return the response for the caller to handle
    return response;
  } catch (error) {
    console.error("Error clearing cart after order:", error.response?.data || error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const getUserCartItems = (userId) => client.get(`${endpoint}/user/${userId}`);

export default {
  addToCart,
  deleteCartItem,
  removeCartItems,
  getUserCartItems,
};
