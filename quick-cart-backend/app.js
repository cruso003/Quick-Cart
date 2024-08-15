import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';  // Import WebSocketServer

import swaggerRoute from './src/routes/swagger.route.js';
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import productRoute from "./src/routes/product.route.js";
import storeRoute from "./src/routes/store.route.js";
import categoryRoute from "./src/routes/category.route.js";
import subcategoryRoute from "./src/routes/subcategory.route.js";
import { approveSeller } from './src/controllers/auth.controller.js';
import bannerRoute from "./src/routes/banner.route.js";
import cartRoute from "./src/routes/cart.route.js";
import orderRoute from "./src/routes/order.route.js";
import walletRoute from "./src/routes/wallet.route.js";
import pickupstationRoute from "./src/routes/pickupstation.route.js";
import messageRoute from "./src/routes/message.route.js";

// Initialize Express
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Default route to serve the OpenAPI documentation
app.use('/', swaggerRoute);

// General Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/stores', storeRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subcategoryRoute);
app.use('/api/v1/products', productRoute);
app.get('/api/v1/approve-seller/:token', approveSeller);
app.use('/api/v1/banners', bannerRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/wallet', walletRoute);
app.use('/api/v1/pickupstation', pickupstationRoute);
app.use('/api/v1/message', messageRoute);

// Start the server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
