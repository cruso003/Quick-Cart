import express from "express";
import axios from "axios";
import Stripe from "stripe";

// Load environment variables
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const MOMO_HOST = process.env.MOMO_HOST || "sandbox.momodeveloper.mtn.com";

// Initialize Stripe with the API key from the environment
const stripe = new Stripe(STRIPE_API_KEY);

// MTN Mobile Money API credentials and endpoints
const momoTokenUrl = `https://${MOMO_HOST}/collection/token/`;
const momoPayUrl = `https://${MOMO_HOST}/collection/v1_0/requesttopay`;

let momoToken = null;

const router = express.Router();

//Endpoint to fetch Momo token
router.post("/get-momo-token", async (req, res) => {
    try {
      const { API_KEY, subscriptionKey } = req.body;
      const momoTokenResponse = await axios.post(
        momoTokenUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            Authorization: `Basic ${API_KEY}`,
          },
        }
      );
      momoToken = momoTokenResponse.data.access_token;
  
      res.json({ momoToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Endpoint to make a request to pay
  router.post("/request-to-pay", async (req, res) => {
    try {
      if (!momoToken) {
        return res.status(400).json({ error: "Momo token not found" });
      }
  
      const { total, phone } = req.body;
      const body = {
        amount: total,
        currency: "EUR",
        externalId: "your_unique_transaction_id",
        payee: {
          partyIdType: "MSISDN",
          partyId: phone ? phone : 46733123454,
        },
        payerMessage: "Payment for order",
        payeeNote: "Thank you for your order",
      };
  
      const momoResponse = await axios.post(momoPayUrl, body, {
        headers: {
          "X-Reference-Id": "",
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": "",
          "Content-Type": "application/json",
          Authorization: `Bearer ${momoToken}`,
        },
      });
      res.json({ momoResponse: momoResponse.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred",
      });
    }
  });
  
  //router endpoints
  router.post("/intents", async (req, res) => {
    try {
      //create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      //Return the secret
      res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  });

export default router;
