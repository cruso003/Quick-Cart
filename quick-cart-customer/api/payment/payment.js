import client from "../client";

const paymentEndpoint = "/payment/intents";
const requestToPayEndpoint = "/payment/request-to-pay";

const requestToPay = async (total, phone) => {
  try {
    const response = await client.post(requestToPayEndpoint, { total, phone });
    
    return response.data;
  } catch (error) {
    console.error("Error requesting to pay:", error);
    throw error;
  }
};

export const createPaymentIntent = (amount) => {
  return client.post(paymentEndpoint, { amount });
};

export default {
  createPaymentIntent,
  requestToPay,
};
